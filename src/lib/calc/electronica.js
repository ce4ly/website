export const COLORES_RESISTENCIA = [
  {
    id: 'negro',
    nombre: 'Negro',
    valor: 0,
    multi: 1,
    tol: null,
    temp: 250,
    hex: '#1c1917'
  },
  {
    id: 'marron',
    nombre: 'Marrón',
    valor: 1,
    multi: 10,
    tol: 1,
    temp: 100,
    hex: '#7c2d12'
  },
  {
    id: 'rojo',
    nombre: 'Rojo',
    valor: 2,
    multi: 100,
    tol: 2,
    temp: 50,
    hex: '#b91c1c'
  },
  {
    id: 'naranjo',
    nombre: 'Naranjo',
    valor: 3,
    multi: 1e3,
    tol: null,
    temp: 15,
    hex: '#ea580c'
  },
  {
    id: 'amarillo',
    nombre: 'Amarillo',
    valor: 4,
    multi: 1e4,
    tol: null,
    temp: 25,
    hex: '#ca8a04'
  },
  {
    id: 'verde',
    nombre: 'Verde',
    valor: 5,
    multi: 1e5,
    tol: 0.5,
    temp: 20,
    hex: '#16a34a'
  },
  {
    id: 'azul',
    nombre: 'Azul',
    valor: 6,
    multi: 1e6,
    tol: 0.25,
    temp: 10,
    hex: '#2563eb'
  },
  {
    id: 'violeta',
    nombre: 'Violeta',
    valor: 7,
    multi: 1e7,
    tol: 0.1,
    temp: 5,
    hex: '#7c3aed'
  },
  {
    id: 'gris',
    nombre: 'Gris',
    valor: 8,
    multi: 1e8,
    tol: 0.05,
    temp: 1,
    hex: '#6b7280'
  },
  {
    id: 'blanco',
    nombre: 'Blanco',
    valor: 9,
    multi: 1e9,
    tol: null,
    temp: null,
    hex: '#f5f5f4'
  },
  {
    id: 'oro',
    nombre: 'Oro',
    valor: null,
    multi: 0.1,
    tol: 5,
    temp: null,
    hex: '#ca8a04'
  },
  {
    id: 'plata',
    nombre: 'Plata',
    valor: null,
    multi: 0.01,
    tol: 10,
    temp: null,
    hex: '#a8a29e'
  }
]

const colorPorId = id => COLORES_RESISTENCIA.find(c => c.id === id)

export const leyOhm = ({ v, i, r, p }) => {
  const dados = ['v', 'i', 'r', 'p'].filter(k =>
    Number.isFinite({ v, i, r, p }[k])
  )
  if (dados.length !== 2)
    return { error: 'Ingresa exactamente dos magnitudes.' }
  const out = { v, i, r, p }
  const set = (clave, valor) => {
    out[clave] = valor
  }
  const par = dados.sort().join('')
  const casos = {
    iv: () => {
      set('r', v / i)
      set('p', v * i)
    },
    rv: () => {
      set('i', v / r)
      set('p', (v * v) / r)
    },
    pv: () => {
      set('i', p / v)
      set('r', (v * v) / p)
    },
    ir: () => {
      set('v', i * r)
      set('p', i * i * r)
    },
    ip: () => {
      set('v', p / i)
      set('r', p / (i * i))
    },
    pr: () => {
      set('v', Math.sqrt(p * r))
      set('i', Math.sqrt(p / r))
    }
  }
  const fn = casos[par]
  if (!fn) return { error: 'Par de magnitudes no válido.' }
  fn()
  if (Object.values(out).some(x => !Number.isFinite(x) || x < 0)) {
    return { error: 'Los valores no permiten un resultado físico.' }
  }
  return out
}

export const coloresAValor = (bandas, ids) => {
  if (ids.length !== bandas) return null
  const cols = ids.map(colorPorId)
  if (cols.some(c => !c)) return null
  const digitos = bandas === 4 ? 2 : 3
  let significativo = 0
  for (let i = 0; i < digitos; i += 1) {
    if (cols[i].valor === null) return null
    significativo = significativo * 10 + cols[i].valor
  }
  const multi = cols[digitos].multi
  const ohm = significativo * multi
  const tol = cols[digitos + 1]?.tol ?? null
  const temp = bandas === 6 ? (cols[5].temp ?? null) : null
  return { ohm, tolerancia: tol, tempco: temp }
}

const MULTIPLOS = [1e9, 1e8, 1e7, 1e6, 1e5, 1e4, 1e3, 100, 10, 1, 0.1, 0.01]

export const valorAColores = (ohm, bandas = 5, tolerancia = 1) => {
  if (!(ohm > 0)) return null
  const digitos = bandas === 4 ? 2 : 3
  const escala = 10 ** (digitos - 1)
  let multiElegido = null
  let sig = null
  for (const m of MULTIPLOS) {
    const s = Math.round(ohm / m)
    if (s >= escala && s < escala * 10) {
      multiElegido = m
      sig = s
      break
    }
  }
  if (multiElegido === null) return null
  const ids = []
  const str = String(sig).padStart(digitos, '0')
  for (const ch of str) {
    const col = COLORES_RESISTENCIA.find(c => c.valor === Number(ch))
    ids.push(col.id)
  }
  const multiCol = COLORES_RESISTENCIA.find(c => c.multi === multiElegido)
  if (!multiCol) return null
  ids.push(multiCol.id)
  const tolCol =
    COLORES_RESISTENCIA.find(c => c.tol === tolerancia) || colorPorId('oro')
  ids.push(tolCol.id)
  if (bandas === 6) ids.push('marron')
  return ids
}

export const divisorTension = ({ vin, r1, r2 }) => {
  if (!(vin >= 0) || !(r1 > 0) || !(r2 > 0)) return null
  const vout = vin * (r2 / (r1 + r2))
  const i = vin / (r1 + r2)
  return {
    vout,
    corriente: i,
    pR1: i * i * r1,
    pR2: i * i * r2
  }
}

export const resonanciaLc = ({ f, l, c }) => {
  const dados = [f, l, c].filter(x => Number.isFinite(x) && x > 0)
  if (dados.length !== 2)
    return { error: 'Ingresa exactamente dos de f, L y C.' }
  const dosPi = 2 * Math.PI
  if (Number.isFinite(l) && l > 0 && Number.isFinite(c) && c > 0) {
    return { f: 1 / (dosPi * Math.sqrt(l * c)), l, c }
  }
  if (Number.isFinite(f) && f > 0 && Number.isFinite(l) && l > 0) {
    return { f, l, c: 1 / ((dosPi * f) ** 2 * l) }
  }
  return { f, l: 1 / ((dosPi * f) ** 2 * c), c }
}
