import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { readFile, writeFile } from 'node:fs/promises'
import { parseSolarXml } from '../src/lib/calc/solar.js'

const FUENTE = 'https://www.hamqsl.com/solarxml.php'
const TTL_MS = 30 * 60 * 1000
const CACHE_FILE = join(tmpdir(), 'ce4ly-solar.json')

let memoria = null

const leerDisco = async () => {
  try {
    const raw = await readFile(CACHE_FILE, 'utf8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const guardar = async payload => {
  memoria = payload
  try {
    await writeFile(CACHE_FILE, JSON.stringify(payload))
  } catch {
    /* ignore */
  }
}

export const getSolar = async () => {
  const ahora = Date.now()
  const cached = memoria || (await leerDisco())
  if (cached?.data && ahora - cached.at < TTL_MS) {
    return { ...cached.data, fetchedAt: cached.at, stale: false }
  }

  try {
    const res = await fetch(FUENTE, { signal: AbortSignal.timeout(10000) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const xml = await res.text()
    const data = parseSolarXml(xml)
    if (!data) throw new Error('XML vacío')
    const payload = { at: ahora, data }
    await guardar(payload)
    return { ...data, fetchedAt: ahora, stale: false }
  } catch {
    if (cached?.data) {
      return { ...cached.data, fetchedAt: cached.at, stale: true }
    }
    return { ok: false, fetchedAt: null, stale: false }
  }
}
