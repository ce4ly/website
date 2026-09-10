const VHF = [
  { canal: 2, min: 54, max: 60 },
  { canal: 3, min: 60, max: 66 },
  { canal: 4, min: 66, max: 72 },
  { canal: 5, min: 76, max: 82 },
  { canal: 6, min: 82, max: 88 },
  { canal: 7, min: 174, max: 180 },
  { canal: 8, min: 180, max: 186 },
  { canal: 9, min: 186, max: 192 },
  { canal: 10, min: 192, max: 198 },
  { canal: 11, min: 198, max: 204 },
  { canal: 12, min: 204, max: 210 },
  { canal: 13, min: 210, max: 216 }
].map(c => ({
  ...c,
  banda: c.canal <= 6 ? 'VHF I' : 'VHF III',
  centro: (c.min + c.max) / 2
}))

const UHF = Array.from({ length: 51 - 14 + 1 }, (_, i) => {
  const canal = 14 + i
  const min = 470 + (canal - 14) * 6
  return {
    canal,
    banda: 'UHF',
    min,
    max: min + 6,
    centro: min + 3,
    nota: canal === 37 ? 'A menudo reservado (608–614 MHz)' : undefined
  }
})

/** Canalización de 6 MHz (ISDB-Tb / plan chileno). El número virtual (13.1) no es el canal de RF. */
export const CANALES_TV_ABIERTA = [...VHF, ...UHF]
