/** Canalización internacional VHF marina (UIT-R, Apéndice 18). Chile usa este plan. */
export const CANALES_MARINOS = [
  {
    ch: '01',
    ship: 156.05,
    coast: 160.65,
    tipo: 'Dúplex',
    uso: 'Correspondencia pública'
  },
  {
    ch: '02',
    ship: 156.1,
    coast: 160.7,
    tipo: 'Dúplex',
    uso: 'Correspondencia pública'
  },
  {
    ch: '03',
    ship: 156.15,
    coast: 160.75,
    tipo: 'Dúplex',
    uso: 'Correspondencia pública'
  },
  {
    ch: '04',
    ship: 156.2,
    coast: 160.8,
    tipo: 'Dúplex',
    uso: 'Correspondencia pública'
  },
  {
    ch: '05',
    ship: 156.25,
    coast: 160.85,
    tipo: 'Dúplex',
    uso: 'Correspondencia pública'
  },
  {
    ch: '06',
    ship: 156.3,
    coast: 156.3,
    tipo: 'Simplex',
    uso: 'Seguridad entre barcos',
    destacar: true
  },
  {
    ch: '07',
    ship: 156.35,
    coast: 160.95,
    tipo: 'Dúplex',
    uso: 'Correspondencia pública'
  },
  { ch: '08', ship: 156.4, coast: 156.4, tipo: 'Simplex', uso: 'Entre barcos' },
  {
    ch: '09',
    ship: 156.45,
    coast: 156.45,
    tipo: 'Simplex',
    uso: 'Llamada / puerto'
  },
  {
    ch: '10',
    ship: 156.5,
    coast: 156.5,
    tipo: 'Simplex',
    uso: 'Operaciones / puerto'
  },
  { ch: '11', ship: 156.55, coast: 156.55, tipo: 'Simplex', uso: 'Puerto' },
  { ch: '12', ship: 156.6, coast: 156.6, tipo: 'Simplex', uso: 'Puerto' },
  {
    ch: '13',
    ship: 156.65,
    coast: 156.65,
    tipo: 'Simplex',
    uso: 'Puente a puente / navegación',
    destacar: true
  },
  { ch: '14', ship: 156.7, coast: 156.7, tipo: 'Simplex', uso: 'Puerto' },
  {
    ch: '15',
    ship: 156.75,
    coast: 156.75,
    tipo: 'Simplex',
    uso: 'A bordo (1 W)'
  },
  {
    ch: '16',
    ship: 156.8,
    coast: 156.8,
    tipo: 'Simplex',
    uso: 'Socorro, seguridad y llamada',
    destacar: true
  },
  {
    ch: '17',
    ship: 156.85,
    coast: 156.85,
    tipo: 'Simplex',
    uso: 'A bordo (1 W)'
  },
  {
    ch: '18',
    ship: 156.9,
    coast: 161.5,
    tipo: 'Dúplex',
    uso: 'Correspondencia pública'
  },
  {
    ch: '19',
    ship: 156.95,
    coast: 161.55,
    tipo: 'Dúplex',
    uso: 'Correspondencia pública'
  },
  {
    ch: '20',
    ship: 157.0,
    coast: 161.6,
    tipo: 'Dúplex',
    uso: 'Correspondencia pública'
  },
  {
    ch: '21',
    ship: 157.05,
    coast: 161.65,
    tipo: 'Dúplex',
    uso: 'Correspondencia pública'
  },
  {
    ch: '22',
    ship: 157.1,
    coast: 161.7,
    tipo: 'Dúplex',
    uso: 'Correspondencia pública'
  },
  {
    ch: '23',
    ship: 157.15,
    coast: 161.75,
    tipo: 'Dúplex',
    uso: 'Correspondencia pública'
  },
  {
    ch: '24',
    ship: 157.2,
    coast: 161.8,
    tipo: 'Dúplex',
    uso: 'Correspondencia pública'
  },
  {
    ch: '25',
    ship: 157.25,
    coast: 161.85,
    tipo: 'Dúplex',
    uso: 'Correspondencia pública'
  },
  {
    ch: '26',
    ship: 157.3,
    coast: 161.9,
    tipo: 'Dúplex',
    uso: 'Correspondencia pública'
  },
  {
    ch: '27',
    ship: 157.35,
    coast: 161.95,
    tipo: 'Dúplex',
    uso: 'Correspondencia pública'
  },
  {
    ch: '28',
    ship: 157.4,
    coast: 162.0,
    tipo: 'Dúplex',
    uso: 'Correspondencia pública'
  },
  {
    ch: '60',
    ship: 156.025,
    coast: 160.625,
    tipo: 'Dúplex',
    uso: 'Correspondencia pública'
  },
  {
    ch: '61',
    ship: 156.075,
    coast: 160.675,
    tipo: 'Dúplex',
    uso: 'Correspondencia pública'
  },
  {
    ch: '62',
    ship: 156.125,
    coast: 160.725,
    tipo: 'Dúplex',
    uso: 'Correspondencia pública'
  },
  {
    ch: '63',
    ship: 156.175,
    coast: 160.775,
    tipo: 'Dúplex',
    uso: 'Correspondencia pública'
  },
  {
    ch: '64',
    ship: 156.225,
    coast: 160.825,
    tipo: 'Dúplex',
    uso: 'Correspondencia pública'
  },
  {
    ch: '65',
    ship: 156.275,
    coast: 160.875,
    tipo: 'Dúplex',
    uso: 'Correspondencia pública'
  },
  {
    ch: '66',
    ship: 156.325,
    coast: 160.925,
    tipo: 'Dúplex',
    uso: 'Correspondencia pública'
  },
  {
    ch: '67',
    ship: 156.375,
    coast: 156.375,
    tipo: 'Simplex',
    uso: 'Puente / operaciones'
  },
  {
    ch: '68',
    ship: 156.425,
    coast: 156.425,
    tipo: 'Simplex',
    uso: 'Puerto / no comercial'
  },
  {
    ch: '69',
    ship: 156.475,
    coast: 156.475,
    tipo: 'Simplex',
    uso: 'Puerto / no comercial'
  },
  {
    ch: '70',
    ship: 156.525,
    coast: 156.525,
    tipo: 'DSC',
    uso: 'Llamada selectiva digital (sin voz)',
    destacar: true
  },
  {
    ch: '71',
    ship: 156.575,
    coast: 156.575,
    tipo: 'Simplex',
    uso: 'Puerto / no comercial'
  },
  {
    ch: '72',
    ship: 156.625,
    coast: 156.625,
    tipo: 'Simplex',
    uso: 'Entre barcos'
  },
  {
    ch: '73',
    ship: 156.675,
    coast: 156.675,
    tipo: 'Simplex',
    uso: 'Puerto / operaciones'
  },
  {
    ch: '74',
    ship: 156.725,
    coast: 156.725,
    tipo: 'Simplex',
    uso: 'Puerto / operaciones'
  },
  {
    ch: '75',
    ship: 156.775,
    coast: 156.775,
    tipo: 'Simplex',
    uso: 'Guardia de 16 (1 W)'
  },
  {
    ch: '76',
    ship: 156.825,
    coast: 156.825,
    tipo: 'Simplex',
    uso: 'Guardia de 16 (1 W)'
  },
  {
    ch: '77',
    ship: 156.875,
    coast: 156.875,
    tipo: 'Simplex',
    uso: 'Entre barcos'
  },
  {
    ch: '78',
    ship: 156.925,
    coast: 161.525,
    tipo: 'Dúplex',
    uso: 'Correspondencia pública'
  },
  {
    ch: '79',
    ship: 156.975,
    coast: 161.575,
    tipo: 'Dúplex',
    uso: 'Correspondencia pública'
  },
  {
    ch: '80',
    ship: 157.025,
    coast: 161.625,
    tipo: 'Dúplex',
    uso: 'Correspondencia pública'
  },
  {
    ch: '81',
    ship: 157.075,
    coast: 161.675,
    tipo: 'Dúplex',
    uso: 'Correspondencia pública'
  },
  {
    ch: '82',
    ship: 157.125,
    coast: 161.725,
    tipo: 'Dúplex',
    uso: 'Correspondencia pública'
  },
  {
    ch: '83',
    ship: 157.175,
    coast: 161.775,
    tipo: 'Dúplex',
    uso: 'Correspondencia pública'
  },
  {
    ch: '84',
    ship: 157.225,
    coast: 161.825,
    tipo: 'Dúplex',
    uso: 'Correspondencia pública'
  },
  {
    ch: '85',
    ship: 157.275,
    coast: 161.875,
    tipo: 'Dúplex',
    uso: 'Correspondencia pública'
  },
  {
    ch: '86',
    ship: 157.325,
    coast: 161.925,
    tipo: 'Dúplex',
    uso: 'Correspondencia pública'
  },
  {
    ch: '87',
    ship: 157.375,
    coast: 157.375,
    tipo: 'Simplex',
    uso: 'Simplex (antes dúplex)'
  },
  {
    ch: '88',
    ship: 157.425,
    coast: 157.425,
    tipo: 'Simplex',
    uso: 'Simplex (antes dúplex)'
  },
  {
    ch: '87B',
    ship: 161.975,
    coast: 161.975,
    tipo: 'AIS',
    uso: 'AIS 1',
    destacar: true
  },
  {
    ch: '88B',
    ship: 162.025,
    coast: 162.025,
    tipo: 'AIS',
    uso: 'AIS 2',
    destacar: true
  }
]
