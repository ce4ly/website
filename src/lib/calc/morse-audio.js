import { textoAMorse, tiemposFarnsworth } from './morse.js'

const tone = (ctx, frec, start, dur, gain) => {
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = frec
  osc.connect(g)
  g.connect(ctx.destination)
  const att = Math.min(0.005, dur / 4)
  const rel = att
  g.gain.setValueAtTime(0, start)
  g.gain.linearRampToValueAtTime(gain, start + att)
  g.gain.setValueAtTime(gain, start + dur - rel)
  g.gain.linearRampToValueAtTime(0, start + dur)
  osc.start(start)
  osc.stop(start + dur + 0.01)
}

export const reproducirMorse = async ({
  texto,
  ppmCaracter = 18,
  ppmEfectivo = 12,
  frecuencia = 600,
  signal
}) => {
  const codigo = textoAMorse(texto)
  if (!codigo) return
  const ctx = new AudioContext()
  const t = tiemposFarnsworth(ppmCaracter, ppmEfectivo)
  let t0 = ctx.currentTime + 0.05
  const abort = () => {
    ctx.close()
  }
  signal?.addEventListener('abort', abort)
  try {
    for (const token of codigo.split(' ')) {
      if (signal?.aborted) break
      if (token === '/') {
        t0 += t.palabra - t.letra
        continue
      }
      for (const ch of token) {
        const dur = ch === '-' ? t.dah : t.dit
        tone(ctx, frecuencia, t0, dur, 0.15)
        t0 += dur + t.intra
      }
      t0 += t.letra - t.intra
    }
    const espera = Math.max(0, t0 - ctx.currentTime) * 1000 + 50
    await new Promise(resolve => setTimeout(resolve, espera))
  } finally {
    signal?.removeEventListener('abort', abort)
    if (ctx.state !== 'closed') await ctx.close()
  }
}
