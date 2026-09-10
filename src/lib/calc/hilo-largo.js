import { LARGO_MEDIA_ONDA } from '../calculadoras.js'

/** Bandas HF IARU R2 usadas en Chile, en MHz. */
export const BANDAS_HILO = [
  { id: '160', nombre: '160 m', fMin: 1.8, fMax: 2.0 },
  { id: '80', nombre: '80 m', fMin: 3.5, fMax: 4.0 },
  { id: '40', nombre: '40 m', fMin: 7.0, fMax: 7.3 },
  { id: '30', nombre: '30 m', fMin: 10.1, fMax: 10.15 },
  { id: '20', nombre: '20 m', fMin: 14.0, fMax: 14.35 },
  { id: '17', nombre: '17 m', fMin: 18.068, fMax: 18.168 },
  { id: '15', nombre: '15 m', fMin: 21.0, fMax: 21.45 },
  { id: '12', nombre: '12 m', fMin: 24.89, fMax: 24.99 },
  { id: '10', nombre: '10 m', fMin: 28.0, fMax: 29.7 }
]

const mediaOnda = mhz => LARGO_MEDIA_ONDA / mhz

export const zonasResonantes = (bandas, nMax = 20) => {
  const zonas = []
  for (const banda of bandas) {
    for (let n = 1; n <= nMax; n += 1) {
      const lMin = n * mediaOnda(banda.fMax)
      const lMax = n * mediaOnda(banda.fMin)
      zonas.push({ banda: banda.id, n, lMin, lMax })
    }
  }
  return zonas
}

export const margenAResonancia = (largoM, zonas) => {
  let mejor = Infinity
  let detalle = null
  for (const z of zonas) {
    if (largoM >= z.lMin && largoM <= z.lMax) {
      return { margen: 0, zona: z }
    }
    const dist = Math.min(Math.abs(largoM - z.lMin), Math.abs(largoM - z.lMax))
    if (dist < mejor) {
      mejor = dist
      detalle = z
    }
  }
  return { margen: mejor, zona: detalle }
}

export const rankearLargos = ({
  bandasIds,
  lMin = 10,
  lMax = 40,
  paso = 0.05,
  top = 8
}) => {
  const bandas = BANDAS_HILO.filter(b => bandasIds.includes(b.id))
  if (!bandas.length || !(lMax > lMin) || !(paso > 0)) return []
  const zonas = zonasResonantes(bandas)
  const candidatos = []
  for (let l = lMin; l <= lMax + 1e-9; l += paso) {
    const largo = Math.round(l * 1000) / 1000
    const { margen, zona } = margenAResonancia(largo, zonas)
    candidatos.push({ largo, margen, zona })
  }
  candidatos.sort((a, b) => b.margen - a.margen || a.largo - b.largo)
  return candidatos.slice(0, top)
}

/** Contrapeso típico: ~0,05 λ de la banda más baja. */
export const largoContrapeso = bandasIds => {
  const bandas = BANDAS_HILO.filter(b => bandasIds.includes(b.id))
  if (!bandas.length) return null
  const fMin = Math.min(...bandas.map(b => b.fMin))
  return 0.05 * (300 / fMin)
}
