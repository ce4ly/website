/**
 * Indicativo de radioaficionado: prefijo de 1–3 caracteres que termina en letra, un dígito y un
 * sufijo de 1–4 letras (CE4LY, CA5NFS, 3G4ABC, XQ4AA).
 */
const INDICATIVO = /^[A-Z0-9]{0,2}[A-Z][0-9][A-Z]{1,4}$/

export const esIndicativo = (texto: string) => INDICATIVO.test(texto)

export type LecturaSocios = {
  /** Indicativos válidos, sin repetir, en orden alfabético. */
  indicativos: string[]
  /** Líneas que no son un indicativo (número de línea y texto). */
  invalidos: { linea: number; texto: string }[]
  /** Indicativos que aparecen más de una vez. */
  duplicados: string[]
}

/**
 * Lee socios.txt: un indicativo por línea. Ignora líneas vacías y comentarios (`#`); acepta
 * minúsculas y espacios alrededor.
 */
export function leerSocios(texto: string): LecturaSocios {
  const vistos = new Set<string>()
  const duplicados = new Set<string>()
  const invalidos: LecturaSocios['invalidos'] = []

  texto.split(/\r?\n/).forEach((cruda, i) => {
    const linea = cruda.replace(/#.*/, '').trim().toUpperCase()
    if (!linea) return
    if (!esIndicativo(linea)) {
      invalidos.push({ linea: i + 1, texto: cruda.trim() })
    } else if (vistos.has(linea)) {
      duplicados.add(linea)
    } else {
      vistos.add(linea)
    }
  })

  return {
    indicativos: [...vistos].sort((a, b) => a.localeCompare(b, 'es')),
    invalidos,
    duplicados: [...duplicados],
  }
}
