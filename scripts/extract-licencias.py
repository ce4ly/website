#!/usr/bin/env python3
"""Extrae el listado SUBTEL de los PDF de la raíz a public/data/licencias.json."""

from __future__ import annotations

import json
import re
import subprocess
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "data" / "licencias.json"

FUENTES = [
    (ROOT / "licencias_aspirantes.pdf", "aspirante"),
    (ROOT / "licencias_novatos_general_superior.pdf", None),
]

CATEGORIA = {"CD": "aspirante", "CA": "novicio", "CE": "general", "XQ": "superior"}

REGIONES = [
    "Región de Aysén del General Carlos Ibáñez del Campo",
    "Región de Magallanes y de la Antártica Chilena",
    "Región del Libertador General Bernardo O'Higgins",
    "Región Metropolitana de Santiago",
    "Región de Arica y Parinacota",
    "Región de la Araucanía",
    "Región de Antofagasta",
    "Región de Valparaíso",
    "Región de Los Lagos",
    "Región de los Ríos",
    "Región de Tarapacá",
    "Región de Coquimbo",
    "Región de Atacama",
    "Región del Biobío",
    "Región del Maule",
    "Región de Ñuble",
    "Región de Nuble",
]

RE_LIC_SOLA = re.compile(r"^\s*(\d{5,})\s*$")
RE_HEAD = re.compile(
    r"""^\s*
    (?:(\d+)-([0-9Kk])\s+)?
    (?:([0-9Kk])\s+)?
    ([A-Z]{2}\d)\s?([A-Z]{2,3})\s+
    (.+)$
    """,
    re.VERBOSE,
)
RE_FECHA = re.compile(r"(\d{2}/\d{2}/\d{4})\s*$")

SKIP = re.compile(
    r"""^(
        LISTADO|CATEGOR|La\sseñal|para\sidentificar|identificar\sla\szona|
        Licencia|CONTACTO|radioaficionados|https?://|\(\d|Listado_|Informes_
    )""",
    re.I,
)


def fold(texto: str) -> str:
    nfd = unicodedata.normalize("NFD", texto.lower())
    return "".join(c for c in nfd if unicodedata.category(c) != "Mn")


def espacios(texto: str) -> str:
    return re.sub(r"\s+", " ", texto).strip()


REGIONES_FOLD = sorted(
    ((fold(r), r) for r in REGIONES), key=lambda x: -len(x[0])
)


def partir_region(resto: str) -> tuple[str, str] | None:
    f = fold(resto)
    for clave, canon in REGIONES_FOLD:
        if f.startswith(clave):
            # recortar la misma cantidad de palabras que el canónico
            n = len(canon.split())
            palabras = resto.split()
            comuna = " ".join(palabras[n:])
            return canon if "nuble" not in fold(canon) else "Región de Ñuble", comuna
    return None


def pdf_texto(pdf: Path) -> str:
    return subprocess.check_output(
        ["pdftotext", "-layout", str(pdf), "-"], text=True, errors="replace"
    )


def es_basura(linea: str) -> bool:
    t = linea.strip()
    if not t or t.startswith("\x0c"):
        return True
    if SKIP.match(t):
        return True
    if "RADIOAFICIONADOS" in t.upper() and "LISTADO" not in t.upper():
        return True
    if re.match(r"^\d+\s*/\s*\d+$", t):
        return True
    if t.startswith("(") or (t[0].isdigit() and "anexo" in t.lower()):
        return True
    return False


def parsear(texto: str, categoria_fija: str | None) -> list[dict]:
    filas = []
    pending_lic = None
    pending_region = ""
    pending_comuna = ""
    pending_nombre = ""

    for raw in texto.splitlines():
        if es_basura(raw):
            continue
        t = raw.strip()

        m_lic = RE_LIC_SOLA.match(t)
        if m_lic:
            pending_lic = m_lic.group(1)
            continue

        m = RE_HEAD.match(raw)
        fecha_m = RE_FECHA.search(raw) if m else None
        if not m or not fecha_m:
            if t.startswith("Región"):
                pending_region = t
            elif t.lower().startswith("san pedro de"):
                pending_comuna = t
            elif re.fullmatch(r"[A-ZÁÉÍÓÚÑÜ ]+", t) and len(t) > 8:
                pending_nombre = t
            continue

        lic_num, lic_dv, lic_dv2, pref, suf, medio = m.groups()
        if lic_num:
            licencia = f"{lic_num}-{lic_dv.upper()}"
        elif pending_lic and lic_dv2:
            licencia = f"{pending_lic}-{lic_dv2.upper()}"
        else:
            continue

        fecha = fecha_m.group(1)
        medio = espacios(RE_FECHA.sub("", medio))
        idx = medio.find("Región")
        if idx == -1:
            idx = medio.find("Campo")
        if idx == -1:
            pending_lic = None
            pending_region = ""
            pending_comuna = ""
            pending_nombre = ""
            continue
        nombre = espacios(medio[:idx])
        after = medio[idx:]
        if pending_region and after.startswith("Campo"):
            after = f"{pending_region} {after}"
        partido = partir_region(after)
        if partido is None:
            pending_lic = None
            pending_region = ""
            pending_comuna = ""
            pending_nombre = ""
            continue
        region, comuna = partido

        if pending_nombre:
            nombre = espacios(f"{pending_nombre} {nombre}")
        if pending_comuna:
            comuna = espacios(f"{pending_comuna} {comuna}")

        indicativo = f"{pref}{suf}"
        cat = categoria_fija or CATEGORIA.get(pref[:2], "")
        filas.append(
            {
                "licencia": licencia,
                "indicativo": indicativo,
                "nombre": nombre,
                "region": region,
                "comuna": comuna,
                "vencimiento": fecha,
                "categoria": cat,
            }
        )
        pending_lic = None
        pending_region = ""
        pending_comuna = ""
        pending_nombre = ""

    return filas


def main() -> None:
    todas = []
    for pdf, cat in FUENTES:
        if not pdf.exists():
            raise SystemExit(f"No está {pdf.name} en la raíz del sitio")
        filas = parsear(pdf_texto(pdf), cat)
        print(f"{pdf.name}: {len(filas)} registros")
        todas.extend(filas)

    vistas = {}
    for f in todas:
        vistas[f["indicativo"]] = f
    unicas = list(vistas.values())
    unicas.sort(key=lambda x: x["indicativo"])

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        json.dumps(
            {
                "fuente": "SUBTEL, listados de radioaficionados, junio 2026",
                "licencias": unicas,
            },
            ensure_ascii=False,
            separators=(",", ":"),
        ),
        encoding="utf-8",
    )
    print(f"Total único: {len(unicas)} → {OUT}")


if __name__ == "__main__":
    main()
