export type Integrante = {
  nombre: string
  indicativo: string
  cargo: string
  /** Foto 320×320 en WebP: `public/[indicativo]-oficial.webp`. */
  foto: string
}

/** Lado (px) de las fotos del directorio. */
export const LADO_FOTO = 320

/**
 * Indicativos que QRZ tiene registrados distinto que SUBTEL. CA5NFS figura en QRZ como CA4NFS: su
 * licencia se emitió y registró mal, y QRZ no deja registrarse con el indicativo válido.
 */
const INDICATIVO_QRZ: Readonly<Record<string, string>> = { CA5NFS: 'CA4NFS' }

/** Perfil de QRZ del indicativo (el sitio muestra siempre el indicativo de SUBTEL). */
export const urlQrz = (indicativo: string) =>
  `https://www.qrz.com/db/${INDICATIVO_QRZ[indicativo] ?? indicativo}`

const fotoOficial = (indicativo: string) => `/${indicativo.toLowerCase()}-oficial.webp`

/** Directorio vigente, en orden de cargo. */
export const DIRECTORIO: readonly Integrante[] = [
  ['Diego Felipe Fuentealba Aliaga', 'CA4DJF', 'Presidente'],
  ['Carlos Antonio Díaz Flores', 'CA4CDF', 'Secretario'],
  ['Gustavo Adolfo Rojas Román', 'CA4GRR', 'Tesorero'],
  ['Carlos Hernández Peña y Lillo', 'CE4CHP', 'Director'],
  ['Rodrigo Fabián Andrés Fuentealba Cartes', 'CA5NFS', 'Director'],
].map(([nombre, indicativo, cargo]) => ({
  nombre,
  indicativo,
  cargo,
  foto: fotoOficial(indicativo),
}))
