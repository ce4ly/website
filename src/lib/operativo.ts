import { CLUB } from './club'
import type { Licencia } from './licencias'

/** Una estación que se reportó en el operativo. */
export type Registro = {
  indicativo: string
  /** Nombre según SUBTEL o, si no figura, el que dicta la estación (puede quedar vacío). */
  nombre: string
  /** Momento del reporte (ISO 8601). */
  hora: string
  /**
   * El indicativo no figura en el listado de SUBTEL, que se actualiza cada seis meses: una
   * licencia nueva puede no estar todavía. El nombre lo anotó el operador.
   */
  noRegistrado?: boolean
}

export type Estacion = Pick<Registro, 'indicativo' | 'nombre' | 'noRegistrado'>

export type Operativo = {
  nombre: string
  /** Fecha del operativo, aaaa-mm-dd. */
  fecha: string
  /** ISO 8601. */
  inicio: string
  /** ISO 8601; `null` mientras el operativo sigue en curso. */
  fin: string | null
  /** En orden de llegada. */
  registros: Registro[]
}

const ZONA_HORARIA = 'America/Santiago'

/** Zona del club (el dígito de CE4LY): sus estaciones van primero en la búsqueda. */
const ZONA_CLUB = CLUB.indicativo.match(/[0-9]/)?.[0] ?? ''

/** Fecha de hoy en Chile, aaaa-mm-dd (el formato de `<input type="date">`). */
export const hoyEnChile = (ahora = new Date()) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: ZONA_HORARIA }).format(ahora)

/** «20:31» en hora de Chile, o en UTC. */
export const horaCorta = (iso: string, timeZone = ZONA_HORARIA) =>
  new Intl.DateTimeFormat('es-CL', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(iso))

/** «2026-10-23» → «23-10-2026». */
export const fechaLegible = (fecha: string) => fecha.split('-').reverse().join('-')

export function iniciarOperativo(nombre: string, fecha: string, ahora = new Date()): Operativo {
  return { nombre: nombre.trim(), fecha, inicio: ahora.toISOString(), fin: null, registros: [] }
}

/** Agrega la estación; si ya está registrada, devuelve el operativo sin cambios. */
export function registrarEstacion(
  operativo: Operativo,
  estacion: Estacion,
  ahora = new Date(),
): Operativo {
  const indicativo = estacion.indicativo.trim().toUpperCase()
  if (operativo.fin || operativo.registros.some((r) => r.indicativo === indicativo)) {
    return operativo
  }
  return {
    ...operativo,
    registros: [
      ...operativo.registros,
      {
        indicativo,
        nombre: estacion.nombre.trim(),
        hora: ahora.toISOString(),
        ...(estacion.noRegistrado && { noRegistrado: true }),
      },
    ],
  }
}

export function quitarEstacion(operativo: Operativo, indicativo: string): Operativo {
  return { ...operativo, registros: operativo.registros.filter((r) => r.indicativo !== indicativo) }
}

export function terminarOperativo(operativo: Operativo, ahora = new Date()): Operativo {
  return operativo.fin ? operativo : { ...operativo, fin: ahora.toISOString() }
}

/** Sufijo de un indicativo: «CA5NFS» → «NFS». */
const sufijo = (indicativo: string) => indicativo.match(/[0-9]([A-Z]+)$/)?.[1] ?? ''

/** Lo escrito, en mayúsculas y sin espacios ni signos. */
const limpiar = (texto: string) => texto.toUpperCase().replace(/[^A-Z0-9]/g, '')

/** Con un dígito se compara el indicativo completo; si no, solo el sufijo. */
const clave = (indicativo: string, q: string) => (/[0-9]/.test(q) ? indicativo : sufijo(indicativo))

/** ¿La licencia corresponde exactamente a lo escrito («NFS» → CA5NFS, pero no CA4NFSX)? */
export const esCoincidenciaExacta = (licencia: Licencia, texto: string) => {
  const q = limpiar(texto)
  return q !== '' && clave(licencia.indicativo, q) === q
}

/**
 * Estaciones por sus letras características: «NFS» encuentra CA5NFS. Primero los sufijos exactos,
 * luego los que empiezan así; en cada grupo, las de la zona del club antes que el resto. Con un
 * dígito («CA5N»), busca por el indicativo completo. Con varias palabras, lo que se escuchó a
 * medias, cada una en cualquier parte del indicativo: «5 FS» encuentra CA5NFS y CD5FSO.
 */
export function buscarPorLetras(licencias: readonly Licencia[], texto: string): Licencia[] {
  const q = limpiar(texto)
  if (!q) return []
  const palabras = texto
    .toUpperCase()
    .split(/[^A-Z0-9]+/)
    .filter(Boolean)
  const rango = (l: Licencia) => (clave(l.indicativo, q) === q ? 0 : 2)
  const zona = (l: Licencia) => (l.indicativo.match(/[0-9]/)?.[0] === ZONA_CLUB ? 0 : 1)
  return licencias
    .filter(
      (l) =>
        clave(l.indicativo, q).startsWith(q) ||
        (palabras.length > 1 && palabras.every((p) => l.indicativo.includes(p))),
    )
    .sort(
      (a, b) =>
        rango(a) + zona(a) - (rango(b) + zona(b)) || a.indicativo.localeCompare(b.indicativo, 'es'),
    )
}

/** Nombre de la estación, con «(no registrado)» si no figura en el listado de SUBTEL. */
export const nombreEnReporte = ({ nombre, noRegistrado }: Registro) =>
  noRegistrado ? `${nombre} (no registrado)`.trim() : nombre

/** Reporte en texto plano del operativo, para descargar como .txt. */
export function reporteTxt(operativo: Operativo): string {
  const { nombre, fecha, inicio, fin, registros } = operativo
  const ancho = Math.max('Indicativo'.length, ...registros.map((r) => r.indicativo.length))
  const fila = (n: string, hora: string, utc: string, indicativo: string, nombreEstacion: string) =>
    `${n.padStart(4)}  ${hora.padEnd(5)}  ${utc.padEnd(5)}  ${indicativo.padEnd(ancho)}  ${nombreEstacion}`.trimEnd()

  return [
    `${CLUB.nombre} ${CLUB.indicativo} — Reporte de operativo`,
    '',
    `Operativo: ${nombre}`,
    `Fecha:     ${fechaLegible(fecha)}`,
    `Inicio:    ${horaCorta(inicio)} (${horaCorta(inicio, 'UTC')} UTC)`,
    `Término:   ${fin ? `${horaCorta(fin)} (${horaCorta(fin, 'UTC')} UTC)` : 'en curso'}`,
    `Estaciones presentes: ${registros.length}`,
    '',
    fila('N°', 'Hora', 'UTC', 'Indicativo', 'Nombre'),
    ...registros.map((r, i) =>
      fila(
        String(i + 1),
        horaCorta(r.hora),
        horaCorta(r.hora, 'UTC'),
        r.indicativo,
        nombreEnReporte(r),
      ),
    ),
    '',
    'Hora: Chile continental. Nombres según el listado de radioaficionados de SUBTEL;',
    '«(no registrado)»: el indicativo no figura en el listado y el nombre lo anotó el operador.',
    '',
  ].join('\n')
}

/** «operativo-2026-10-23-ejercicio-de-emergencia.txt» */
export function nombreArchivoReporte(operativo: Operativo): string {
  const slug = operativo.nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `operativo-${operativo.fecha}${slug ? `-${slug}` : ''}.txt`
}

/** Valida lo leído de localStorage: si no tiene la forma esperada, se descarta. */
export function esOperativo(valor: unknown): valor is Operativo {
  if (!valor || typeof valor !== 'object') return false
  const o = valor as Record<string, unknown>
  return (
    typeof o.nombre === 'string' &&
    typeof o.fecha === 'string' &&
    typeof o.inicio === 'string' &&
    (o.fin === null || typeof o.fin === 'string') &&
    Array.isArray(o.registros) &&
    o.registros.every(
      (r: unknown) =>
        !!r &&
        typeof r === 'object' &&
        typeof (r as Registro).indicativo === 'string' &&
        typeof (r as Registro).nombre === 'string' &&
        typeof (r as Registro).hora === 'string' &&
        ['undefined', 'boolean'].includes(typeof (r as Registro).noRegistrado),
    )
  )
}
