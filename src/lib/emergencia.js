export const REDES_CE3SER = [
  {
    red: 'RECNA',
    banda: '40 m',
    freq: '7,190 MHz',
    modo: 'LSB',
    cuando: 'L–V 20:30–21:30'
  },
  {
    red: 'Chile Mar y Tierra',
    banda: '20 m',
    freq: '14,255 MHz',
    modo: 'USB',
    cuando: 'L–D 13:30–14:30'
  },
  {
    red: 'Banda 15 m',
    banda: '15 m',
    freq: '21,315 MHz',
    modo: 'USB',
    cuando: 'V–S–D'
  },
  {
    red: 'Simplex VHF',
    banda: '2 m',
    freq: '146,520 MHz',
    modo: 'FM',
    cuando: 'Diario 20:30–21:30'
  },
  {
    red: 'Simplex UHF',
    banda: '70 cm',
    freq: '433,520 MHz',
    modo: 'FM',
    cuando: 'Diario 21:30–21:45'
  },
  {
    red: 'Repetidor VHF',
    banda: '2 m',
    freq: '147,360 +600 · tono 123,0',
    modo: 'FM',
    cuando: 'Dom 21:45–22:00'
  },
  {
    red: 'Repetidor UHF',
    banda: '70 cm',
    freq: '433,275 +5,000 · tono 123,0',
    modo: 'FM',
    cuando: 'Mar 21:45–22:00'
  },
  {
    red: 'Repetidor UHF',
    banda: '70 cm',
    freq: '433,375 +5,000 · tono 123,0',
    modo: 'FM',
    cuando: 'Jue 21:45–22:00'
  }
]

export const IARU_R2 = [
  {
    banda: '80 m',
    freq: '3,750 MHz',
    nota: 'Centro IARU R2. En Chile la banda termina aquí; 3,985 no está atribuida.'
  },
  {
    banda: '40 m',
    freq: '7,060 / 7,240 / 7,275 MHz',
    nota: 'Centros de actividad IARU R2'
  },
  { banda: '20 m', freq: '14,300 MHz', nota: 'Centro mundial de emergencia' },
  { banda: '17 m', freq: '18,160 MHz', nota: 'Centro mundial de emergencia' },
  { banda: '15 m', freq: '21,360 MHz', nota: 'Centro mundial de emergencia' },
  { banda: '12 m', freq: '24,960 MHz', nota: 'Centro de actividad' },
  { banda: '10 m', freq: '28,360 MHz', nota: 'Centro de actividad' },
  { banda: '6 m', freq: '50,350 / 52,525 MHz', nota: 'CW / FM de llamada' },
  { banda: '2 m', freq: '146,520 MHz', nota: 'Simplex de llamada FM' },
  {
    banda: '70 cm',
    freq: '446,000 MHz',
    nota: 'Simplex de llamada FM (uso internacional)'
  }
]

export const SOCORRO_INTERNACIONAL = [
  {
    servicio: 'Marino MF',
    freq: '2182 kHz',
    uso: 'Socorro y llamada por voz'
  },
  {
    servicio: 'Marino VHF 16',
    freq: '156,800 MHz',
    uso: 'Socorro, seguridad y llamada'
  },
  {
    servicio: 'Marino DSC 70',
    freq: '156,525 MHz',
    uso: 'Llamada selectiva digital'
  },
  { servicio: 'Aviación', freq: '121,500 MHz', uso: 'Socorro aéreo' },
  { servicio: 'Aviación militar', freq: '243,000 MHz', uso: 'Socorro UHF' },
  {
    servicio: 'Cospas-Sarsat',
    freq: '406 MHz',
    uso: 'Balizas de emergencia (EPIRB / PLB)'
  },
  {
    servicio: 'Banda ciudadana 9',
    freq: '27,065 MHz',
    uso: 'Canal de emergencia CB'
  }
]
