export type NumeroTelefono = {
  /** Como se muestra («600 586 7700»). */
  numero: string
  /** Como se marca, si difiere de `numero` sin espacios. */
  tel?: string
  nombre: string
}

/** Números cortos de respuesta inmediata, publicados por organismos del Estado. */
export const NUMEROS_URGENCIA: readonly NumeroTelefono[] = [
  { numero: '131', nombre: 'Ambulancia (SAMU)' },
  { numero: '132', nombre: 'Bomberos' },
  { numero: '133', nombre: 'Carabineros' },
  { numero: '134', nombre: 'PDI (Policía de Investigaciones)' },
  { numero: '130', nombre: 'CONAF (incendios forestales)' },
  { numero: '137', nombre: 'Emergencias marítimas (DIRECTEMAR)' },
]

/** Líneas oficiales de orientación o denuncia; no reemplazan al 131, 132 o 133. */
export const LINEAS_AYUDA: readonly NumeroTelefono[] = [
  { numero: '1455', nombre: 'Violencia contra la mujer' },
  { numero: '149', nombre: 'Fono Familia (Carabineros)' },
  { numero: '147', nombre: 'Fono Niños (Carabineros)' },
  { numero: '*4242', tel: '*4242', nombre: 'Denuncia Seguro (anónima)' },
  {
    numero: '600 586 7700',
    tel: '6005867700',
    nombre: 'SENAPRED (orientación ante desastres)',
  },
]
