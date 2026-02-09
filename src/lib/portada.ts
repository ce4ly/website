import type { NombreIcono } from '../components/partials/Icono'
import { CLUB } from './club'
import type { PaginaId } from './paginas'
import { REPETIDORAS } from './repetidoras'

/**
 * Contenido de la portada. Vive aquí —no en el JSX— para cambiarlo sin tocar el componente.
 */
export const PORTADA = {
  ubicacion: 'CE4LY · Talca, Región del Maule',
  lema: 'Donde cada voz importa.',
  presentacion:
    'Desde el 25 de febrero de 2018 reunimos a radioaficionados de la Región del Maule para aprender, experimentar y servir a la comunidad. ¿Ya eres radioaficionado o aún no lo eres? La radio nos conecta a todos.',
}

/** Repetidoras con `enAire: true` (src/lib/repetidoras.ts); si no hay ninguna, el bloque no aparece. */
export const REPETIDORAS_EN_AIRE = REPETIDORAS.filter((r) => r.enAire)

export type TarjetaQueHacemos = {
  titulo: string
  icono: NombreIcono
  texto: string
  /** Texto del enlace al pie de la tarjeta. */
  enlace: string
} & ({ pagina: PaginaId } | { url: string })

/**
 * Tarjetas de «Qué hacemos», en orden (boletines al medio). Las actividades llevan al Instagram,
 * que es donde el club publica más seguido.
 */
export const QUE_HACEMOS: readonly TarjetaQueHacemos[] = [
  {
    pagina: 'cursos',
    titulo: 'Cursos abiertos',
    icono: 'cursos',
    texto:
      'Electrónica básica, confección de antenas y reglamentación para el examen de SUBTEL, abiertos a toda la comunidad.',
    enlace: 'Ver los cursos',
  },
  {
    pagina: 'boletines',
    titulo: 'Boletines',
    icono: 'boletines',
    texto: 'Boletines informativos del club en audio, con feed RSS para no perderse ninguno.',
    enlace: 'Todos los boletines',
  },
  {
    url: CLUB.redes.instagram,
    titulo: 'Actividades',
    icono: 'usuarios',
    texto:
      'Ejercicios radiales, encuentros y el Jamboree en el Aire (JOTA-JOTI). Las fotos y novedades, al día en nuestro Instagram.',
    enlace: 'Síguenos en Instagram',
  },
]

/** Horario de los boletines (hora de Chile). Días con lunes = 0. */
export const HORARIO_BOLETINES = {
  dias: [2, 5],
  descripcion: 'Miércoles y sábado',
  inicio: '20:30',
  fin: '21:00',
} as const
