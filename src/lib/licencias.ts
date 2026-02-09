/** Listado de SUBTEL; lo genera scripts/extract-licencias.py. */
export const LISTADO_URL = '/data/licencias.json'

/** Indicativos de los socios del club; lo genera scripts/socios.ts desde socios.txt. */
export const SOCIOS_URL = '/data/socios.json'

export type Licencia = {
  licencia: string
  indicativo: string
  /** Como lo publica SUBTEL: apellidos primero, en mayúsculas. */
  nombre: string
  region: string
  comuna: string
  /** dd/mm/aaaa */
  vencimiento: string
  categoria: string
}

export type Listado = { fuente: string; licencias: Licencia[] }

export type ListadoSocios = { indicativos: string[] }

/** Un socio y su licencia; `null` si su indicativo no figura en el listado de SUBTEL. */
export type Socio = { indicativo: string; licencia: Licencia | null }

/** Sin tildes, mayúsculas ni espacios: «ca 5nfs» encuentra «CA5NFS». */
export const normalizar = (texto: string) =>
  texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '')

const parseFecha = (ddmmaaaa: string) => {
  const [d, m, y] = ddmmaaaa.split('/').map(Number)
  return new Date(y, m - 1, d)
}

export const vencida = (fecha: string, hoy = new Date()) =>
  parseFecha(fecha) < new Date(hoy.toDateString())

export type OpcionesBusqueda = {
  /** Compara solo con el indicativo: «ria» no trae a los ARRIAGADA. */
  soloIndicativos?: boolean
}

/**
 * Criterio para filtrar por `busqueda` (el texto tal como se escribió). Coincide la búsqueda entera,
 * sin espacios («ca 5nfs»), o cada palabra por separado y en cualquier orden, en el indicativo, el
 * nombre o la licencia: así se encuentra lo que se escuchó a medias («5 fs rigo» → CA5NFS RODRIGO)
 * aunque SUBTEL ponga primero los apellidos («rod fuentealba»).
 */
const criterio = (busqueda: string, { soloIndicativos = false }: OpcionesBusqueda = {}) => {
  const q = normalizar(busqueda)
  const palabras = busqueda.split(/\s+/).map(normalizar).filter(Boolean)
  return (l: Licencia) => {
    const campos = soloIndicativos
      ? [normalizar(l.indicativo)]
      : [normalizar(l.indicativo), normalizar(l.nombre), normalizar(l.licencia)]
    return (
      campos.some((campo) => campo.includes(q)) ||
      palabras.every((p) => campos.some((campo) => campo.includes(p)))
    )
  }
}

/**
 * Indicativos que no están en SUBTEL pero que la gente busca, a quién llevan y qué nota muestran.
 * CA5NFS figura en QRZ como CA4NFS porque su licencia se emitió y registró mal; CA4KKW aparece en
 * el listado de SUBTEL como CD4EZH y CD4KKW (corregido en scripts/extract-licencias.py).
 */
const ALIAS: Readonly<Record<string, { titular: string; nota: string }>> = {
  ca4nfs: { titular: 'ca5nfs', nota: '(¡gracias Subtel!)' },
  cd4ezh: { titular: 'ca4kkw', nota: '(Subtelcosas)' },
  cd4kkw: { titular: 'ca4kkw', nota: '(Subtelcosas)' },
}

/**
 * Coincidencias con `busqueda`: indicativo exacto, luego prefijo, luego el resto de los indicativos
 * y al final nombres y licencias, cada grupo de la A a la Z. Con un alias, su titular va primero
 * (sin ocultar a quien tenga de verdad ese indicativo).
 */
export function buscarLicencias(
  licencias: readonly Licencia[],
  busqueda: string,
  opciones: OpcionesBusqueda = {},
): Licencia[] {
  const consulta = normalizar(busqueda)
  const rango = (l: Licencia) => {
    const ind = normalizar(l.indicativo)
    if (ind === consulta) return 0
    if (ind.startsWith(consulta)) return 1
    return ind.includes(consulta) ? 2 : 3
  }
  const directos = licencias
    .filter(criterio(busqueda, opciones))
    .sort((a, b) => rango(a) - rango(b) || a.indicativo.localeCompare(b.indicativo, 'es'))
  const alias = ALIAS[consulta]
  if (!alias) return directos
  const titular = licencias.filter(
    (l) => normalizar(l.indicativo) === alias.titular && !directos.includes(l),
  )
  return [...titular, ...directos]
}

export type Adornos = { corazon: boolean; nota: string | null }

/** Easter eggs de una fila según lo que se buscó. */
export const adornosLicencia = (l: Licencia, busqueda: string): Adornos => {
  const consulta = normalizar(busqueda)
  return {
    corazon: (consulta === 'eyt' || consulta === 'cd4eyt') && l.indicativo === 'CD4EYT',
    nota: normalizar(l.indicativo) === ALIAS[consulta]?.titular ? ALIAS[consulta].nota : null,
  }
}

/**
 * Socios en orden alfabético por apellido (el nombre de SUBTEL empieza por los apellidos). Los que
 * no figuran en SUBTEL van al final, por indicativo. Con `busqueda`, solo los que coinciden.
 */
export function listarSocios(
  licencias: readonly Licencia[],
  indicativos: readonly string[],
  busqueda = '',
  opciones: OpcionesBusqueda = {},
): Socio[] {
  const porIndicativo = new Map(licencias.map((l) => [l.indicativo, l]))
  const coincide = criterio(busqueda, opciones)
  const consulta = normalizar(busqueda)
  return indicativos
    .map((indicativo) => ({ indicativo, licencia: porIndicativo.get(indicativo) ?? null }))
    .filter(({ indicativo, licencia }) =>
      licencia ? coincide(licencia) : normalizar(indicativo).includes(consulta),
    )
    .sort((a, b) => {
      if (a.licencia && b.licencia) return a.licencia.nombre.localeCompare(b.licencia.nombre, 'es')
      if (a.licencia || b.licencia) return a.licencia ? -1 : 1
      return a.indicativo.localeCompare(b.indicativo, 'es')
    })
}

/** Zona y sufijo de un indicativo: «CA4BWW» → «4BWW» (el prefijo cambia con la categoría). */
const zonaYSufijo = (indicativo: string) => indicativo.match(/[0-9][A-Z]+$/)?.[0] ?? indicativo

/**
 * Licencias con la misma zona y sufijo que `indicativo` pero otro prefijo: candidatas cuando un
 * socio no aparece en SUBTEL porque cambió de categoría (CD → CA → CE) o se anotó mal.
 */
export function candidatosPorSufijo(
  licencias: readonly Licencia[],
  indicativo: string,
): Licencia[] {
  const buscado = zonaYSufijo(indicativo)
  return licencias.filter(
    (l) => l.indicativo !== indicativo && zonaYSufijo(l.indicativo) === buscado,
  )
}
