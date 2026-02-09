/**
 * Bandas de radioaficionado en Chile (Decreto Nº 523 y Plan General de Uso del Espectro) con los
 * segmentos de modo del plan voluntario de IARU Región 2, recortados a las atribuciones chilenas.
 */

export const MODOS = ['CW', 'LSB', 'USB', 'AM', 'FM', 'Digital'] as const

export type Modo = (typeof MODOS)[number]

export type CategoriaLicencia = { prefijo: string; nombre: string; descripcion: string }

export type Segmento = { min: number; max: number; modos: readonly Modo[]; nota?: string }

export type BandaAficionado = {
  banda: string
  min: number
  max: number
  unidad: 'MHz' | 'GHz'
  decimales: number
  /** Permitida para cada categoría de licencia. */
  cd: boolean
  ca: boolean
  ce: boolean
  xq: boolean
  /** Advertencia sobre la banda (se muestra en rojo). */
  nota?: string
  segmentos: readonly Segmento[]
}

export const CATEGORIAS: readonly CategoriaLicencia[] = [
  {
    prefijo: 'CD',
    nombre: 'Aspirante',
    descripcion:
      'Primera categoría. HF en 80 m, 40 m y 10 m; VHF en 2 m (con restricciones de supervisión para menores de 15 años).',
  },
  {
    prefijo: 'CA',
    nombre: 'Novicio',
    descripcion:
      'Pueden operar en: 80 m, 40 m, 30 m, 10 m, 6 m, 2 m, 1¼ m, 70 cm, 23 cm, 13 cm y 5,8 cm.',
  },
  {
    prefijo: 'CE',
    nombre: 'General',
    descripcion:
      'Todas las bandas atribuidas al servicio de radioaficionados según el Plan General de Uso del Espectro Radioeléctrico.',
  },
  {
    prefijo: 'XQ',
    nombre: 'Superior',
    descripcion:
      'Todas las bandas atribuidas al servicio de radioaficionados, con facultades adicionales de experimentación.',
  },
]

export const BANDAS: readonly BandaAficionado[] = [
  {
    banda: '160 m',
    min: 1.8,
    max: 1.85,
    unidad: 'MHz',
    decimales: 3,
    cd: false,
    ca: false,
    ce: true,
    xq: true,
    segmentos: [
      { min: 1.8, max: 1.81, modos: ['Digital'] },
      { min: 1.81, max: 1.84, modos: ['CW'] },
      {
        min: 1.84,
        max: 1.85,
        modos: ['CW', 'LSB', 'AM', 'Digital'],
        nota: 'Fonía en LSB',
      },
    ],
  },
  {
    banda: '80 m',
    min: 3.5,
    max: 3.75,
    unidad: 'MHz',
    decimales: 3,
    cd: true,
    ca: true,
    ce: true,
    xq: true,
    segmentos: [
      { min: 3.5, max: 3.57, modos: ['CW'], nota: 'Ventana DX / QRS' },
      { min: 3.57, max: 3.6, modos: ['CW', 'Digital'] },
      {
        min: 3.6,
        max: 3.75,
        modos: ['CW', 'LSB', 'AM', 'Digital'],
        nota: 'Fonía en LSB; AM permitido',
      },
    ],
  },
  {
    banda: '40 m',
    min: 7.0,
    max: 7.3,
    unidad: 'MHz',
    decimales: 3,
    cd: true,
    ca: true,
    ce: true,
    xq: true,
    segmentos: [
      { min: 7.0, max: 7.04, modos: ['CW'], nota: 'Ventana DX / QRP' },
      { min: 7.04, max: 7.05, modos: ['CW', 'Digital'] },
      {
        min: 7.05,
        max: 7.3,
        modos: ['CW', 'LSB', 'AM', 'Digital'],
        nota: 'Fonía en LSB; AM permitido',
      },
    ],
  },
  {
    banda: '30 m',
    min: 10.1,
    max: 10.15,
    unidad: 'MHz',
    decimales: 3,
    cd: false,
    ca: true,
    ce: true,
    xq: true,
    segmentos: [
      { min: 10.1, max: 10.13, modos: ['CW'] },
      {
        min: 10.13,
        max: 10.15,
        modos: ['CW', 'Digital'],
        nota: 'Sin fonía (IARU R2)',
      },
    ],
  },
  {
    banda: '20 m',
    min: 14.0,
    max: 14.35,
    unidad: 'MHz',
    decimales: 3,
    cd: false,
    ca: false,
    ce: true,
    xq: true,
    segmentos: [
      { min: 14.0, max: 14.07, modos: ['CW'], nota: 'Ventana DX / QRP' },
      { min: 14.07, max: 14.099, modos: ['CW', 'Digital'] },
      {
        min: 14.099,
        max: 14.101,
        modos: ['CW'],
        nota: 'Radiofaro IBP (exclusivo)',
      },
      {
        min: 14.101,
        max: 14.35,
        modos: ['CW', 'USB', 'AM', 'Digital'],
        nota: 'Fonía en USB; AM sobre 14,285',
      },
    ],
  },
  {
    banda: '17 m',
    min: 18.068,
    max: 18.168,
    unidad: 'MHz',
    decimales: 3,
    cd: false,
    ca: false,
    ce: true,
    xq: true,
    segmentos: [
      { min: 18.068, max: 18.095, modos: ['CW'] },
      { min: 18.095, max: 18.109, modos: ['CW', 'Digital'] },
      {
        min: 18.109,
        max: 18.111,
        modos: ['CW'],
        nota: 'Radiofaro IBP (exclusivo)',
      },
      {
        min: 18.111,
        max: 18.168,
        modos: ['CW', 'USB', 'Digital'],
        nota: 'Fonía en USB',
      },
    ],
  },
  {
    banda: '15 m',
    min: 21.0,
    max: 21.45,
    unidad: 'MHz',
    decimales: 3,
    cd: false,
    ca: false,
    ce: true,
    xq: true,
    segmentos: [
      { min: 21.0, max: 21.07, modos: ['CW'] },
      { min: 21.07, max: 21.149, modos: ['CW', 'Digital'] },
      {
        min: 21.149,
        max: 21.151,
        modos: ['CW'],
        nota: 'Radiofaro IBP (exclusivo)',
      },
      {
        min: 21.151,
        max: 21.45,
        modos: ['CW', 'USB', 'AM', 'Digital'],
        nota: 'Fonía en USB',
      },
    ],
  },
  {
    banda: '12 m',
    min: 24.89,
    max: 24.99,
    unidad: 'MHz',
    decimales: 3,
    cd: false,
    ca: false,
    ce: true,
    xq: true,
    segmentos: [
      { min: 24.89, max: 24.915, modos: ['CW'] },
      { min: 24.915, max: 24.929, modos: ['CW', 'Digital'] },
      {
        min: 24.929,
        max: 24.931,
        modos: ['CW'],
        nota: 'Radiofaro IBP (exclusivo)',
      },
      {
        min: 24.931,
        max: 24.99,
        modos: ['CW', 'USB', 'Digital'],
        nota: 'Fonía en USB',
      },
    ],
  },
  {
    banda: '10 m',
    min: 28.0,
    max: 29.7,
    unidad: 'MHz',
    decimales: 3,
    cd: true,
    ca: true,
    ce: true,
    xq: true,
    segmentos: [
      { min: 28.0, max: 28.07, modos: ['CW'] },
      { min: 28.07, max: 28.19, modos: ['CW', 'Digital'] },
      {
        min: 28.19,
        max: 28.225,
        modos: ['CW'],
        nota: 'Radiofaros / IBP',
      },
      {
        min: 28.225,
        max: 29.2,
        modos: ['CW', 'USB', 'AM', 'Digital'],
        nota: 'Fonía en USB',
      },
      {
        min: 29.2,
        max: 29.51,
        modos: ['CW', 'USB', 'AM', 'Digital'],
        nota: 'AM preferente; satélite 29,300–29,510',
      },
      {
        min: 29.52,
        max: 29.7,
        modos: ['FM', 'Digital'],
        nota: 'Simplex y repetidoras; llamada 29,600',
      },
    ],
  },
  {
    banda: '6 m',
    min: 50.0,
    max: 54.0,
    unidad: 'MHz',
    decimales: 3,
    cd: false,
    ca: true,
    ce: true,
    xq: true,
    segmentos: [
      { min: 50.0, max: 50.1, modos: ['CW'], nota: 'Radiofaros' },
      {
        min: 50.1,
        max: 50.4,
        modos: ['CW', 'USB', 'Digital'],
        nota: 'Ventana DX; llamada 50,110',
      },
      {
        min: 50.4,
        max: 51.1,
        modos: ['CW', 'USB', 'AM', 'Digital'],
      },
      {
        min: 51.1,
        max: 54.0,
        modos: ['CW', 'USB', 'AM', 'FM', 'Digital'],
        nota: 'FM / repetidoras en la parte alta',
      },
    ],
  },
  {
    banda: '2 m',
    min: 144.0,
    max: 148.0,
    unidad: 'MHz',
    decimales: 3,
    cd: true,
    ca: true,
    ce: true,
    xq: true,
    segmentos: [
      {
        min: 144.0,
        max: 144.4,
        modos: ['CW', 'USB', 'Digital'],
        nota: 'Señales débiles / EME; llamada 144,300',
      },
      {
        min: 144.4,
        max: 145.8,
        modos: ['FM', 'Digital'],
        nota: 'Repetidoras y simplex',
      },
      {
        min: 145.8,
        max: 146.0,
        modos: ['USB', 'Digital'],
        nota: 'Satélite (exclusivo)',
      },
      {
        min: 146.0,
        max: 148.0,
        modos: ['FM', 'Digital'],
        nota: 'Repetidoras y simplex; llamada 146,520',
      },
    ],
  },
  {
    banda: '1¼ m',
    min: 220.0,
    max: 225.0,
    unidad: 'MHz',
    decimales: 3,
    cd: false,
    ca: true,
    ce: true,
    xq: true,
    segmentos: [
      {
        min: 220.0,
        max: 222.0,
        modos: ['CW', 'USB', 'AM', 'FM', 'Digital'],
      },
      {
        min: 222.0,
        max: 222.15,
        modos: ['CW', 'USB', 'Digital'],
        nota: 'Señales débiles; llamada 222,100',
      },
      {
        min: 222.15,
        max: 225.0,
        modos: ['FM', 'Digital'],
        nota: 'Repetidoras y simplex',
      },
    ],
  },
  {
    banda: '70 cm',
    min: 430.0,
    max: 440.0,
    unidad: 'MHz',
    decimales: 3,
    cd: false,
    ca: true,
    ce: true,
    xq: true,
    segmentos: [
      {
        min: 430.0,
        max: 432.0,
        modos: ['FM', 'Digital'],
        nota: 'Uso local / ATV según coordinación',
      },
      {
        min: 432.0,
        max: 433.0,
        modos: ['CW', 'USB', 'Digital'],
        nota: 'Señales débiles; llamada 432,100',
      },
      {
        min: 433.0,
        max: 435.0,
        modos: ['FM', 'Digital'],
      },
      {
        min: 435.0,
        max: 438.0,
        modos: ['USB', 'Digital'],
        nota: 'Satélite (exclusivo)',
      },
      {
        min: 438.0,
        max: 440.0,
        modos: ['FM', 'Digital'],
        nota: 'Uso local / repetidoras',
      },
    ],
  },
  {
    banda: '23 cm',
    min: 1.24,
    max: 1.3,
    unidad: 'GHz',
    decimales: 3,
    cd: false,
    ca: true,
    ce: true,
    xq: true,
    segmentos: [
      {
        min: 1.24,
        max: 1.3,
        modos: ['CW', 'USB', 'AM', 'FM', 'Digital'],
        nota: 'ATV, FM, señales débiles y enlaces según plan local',
      },
    ],
  },
  {
    banda: '13 cm',
    min: 2.4,
    max: 2.45,
    unidad: 'GHz',
    decimales: 3,
    cd: false,
    ca: true,
    ce: true,
    xq: true,
    segmentos: [
      {
        min: 2.4,
        max: 2.45,
        modos: ['CW', 'USB', 'FM', 'Digital'],
        nota: 'Experimental, datos y satélite',
      },
    ],
  },
  {
    banda: '5,8 cm',
    min: 5.65,
    max: 5.65,
    unidad: 'GHz',
    decimales: 3,
    cd: false,
    ca: true,
    ce: true,
    xq: true,
    segmentos: [
      {
        min: 5.65,
        max: 5.65,
        modos: ['CW', 'USB', 'FM', 'Digital'],
        nota: 'Experimental',
      },
    ],
  },
]
