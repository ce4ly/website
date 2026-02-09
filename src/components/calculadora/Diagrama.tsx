import { useId, type ReactNode, type SVGProps } from 'react'

/**
 * Piezas de los diagramas esquemáticos de antenas. Todo usa `currentColor`, así que el diagrama
 * toma el color del texto en ambos temas; la alimentación va en el color de acento.
 */

type DiagramaProps = {
  /** Texto accesible del diagrama (`<title>` del SVG). */
  titulo: string
  viewBox: string
  /** Ancho máximo de la figura. */
  ancho?: 'max-w-sm' | 'max-w-md'
  /** Pie de figura; por defecto, el aviso de que no está a escala. */
  pie?: ReactNode
  children: ReactNode
}

const PIE_POR_DEFECTO = 'Vista de frente (no a escala). Las letras coinciden con las medidas.'

const Diagrama = ({ titulo, viewBox, ancho = 'max-w-md', pie, children }: DiagramaProps) => {
  const tituloId = useId()
  return (
    <figure className={`mx-auto w-full ${ancho} text-stone-700 dark:text-indigo-200`}>
      <svg viewBox={viewBox} className='h-auto w-full' aria-labelledby={tituloId} role='img'>
        <title id={tituloId}>{titulo}</title>
        {children}
      </svg>
      <figcaption className='mt-2 text-center text-xs text-stone-500 dark:text-indigo-300/80'>
        {pie ?? PIE_POR_DEFECTO}
      </figcaption>
    </figure>
  )
}

type Segmento = { x1: number; y1: number; x2: number; y2: number }

/** Línea en el color del texto; por defecto, trazo fino de 1 px (líneas de cota, suelo…). */
export const Linea = ({ strokeWidth = 1, ...props }: SVGProps<SVGLineElement>) => (
  <line stroke='currentColor' strokeWidth={strokeWidth} {...props} />
)

/** Línea de suelo (1,5 px) con trazos de rayado de 12 × 8 px que arrancan en cada `marcas[i]`. */
export const Suelo = ({
  x1,
  x2,
  y,
  marcas,
}: {
  x1: number
  x2: number
  y: number
  marcas: readonly number[]
}) => (
  <>
    <Linea x1={x1} y1={y} x2={x2} y2={y} strokeWidth={1.5} />
    {marcas.map((x) => (
      <Linea key={x} x1={x} y1={y + 8} x2={x + 12} y2={y} />
    ))}
  </>
)

/** Conductor de la antena: trazo grueso con puntas redondeadas. */
export const Alambre = ({
  grosor = 5,
  ...segmento
}: Segmento & { grosor?: number } & Omit<SVGProps<SVGLineElement>, keyof Segmento>) => (
  <line stroke='currentColor' strokeWidth={grosor} strokeLinecap='round' {...segmento} />
)

/** Extremo libre de un conductor. */
export const Punta = ({ cx, cy, r = 4 }: { cx: number; cy: number; r?: number }) => (
  <circle cx={cx} cy={cy} r={r} fill='currentColor' />
)

/** Punto de alimentación, en el color de acento. */
export const Alimentacion = ({ cx, cy, r = 7 }: { cx: number; cy: number; r?: number }) => (
  <circle cx={cx} cy={cy} r={r} className='fill-blue-950 dark:fill-indigo-400' />
)

type EtiquetaProps = {
  x: number
  y: number
  children: ReactNode
  /** 14 px para las letras de cota; 13 px donde el espacio es justo. */
  tamano?: 13 | 14
  textAnchor?: 'start' | 'middle' | 'end'
  transform?: string
}

// Clases literales: Tailwind solo genera las que encuentra escritas completas en el código.
const TAMANO_ETIQUETA = { 13: 'text-[13px]', 14: 'text-[14px]' } as const

/** Letra de una medida (L, s, θ…), la misma que muestra la tabla de resultados. */
export const Etiqueta = ({
  x,
  y,
  children,
  tamano = 14,
  textAnchor = 'middle',
  transform,
}: EtiquetaProps) => (
  <text
    x={x}
    y={y}
    textAnchor={textAnchor}
    className={`fill-current font-serif ${TAMANO_ETIQUETA[tamano]} font-semibold`}
    transform={transform}
  >
    {children}
  </text>
)

/** Rótulo descriptivo pequeño («alimentación», «unun»…). */
export const Rotulo = ({
  x,
  y,
  children,
  textAnchor = 'start',
}: {
  x: number
  y: number
  children: ReactNode
  textAnchor?: 'start' | 'middle' | 'end'
}) => (
  <text x={x} y={y} textAnchor={textAnchor} className='fill-current font-sans text-[11px]'>
    {children}
  </text>
)

/**
 * Línea de cota horizontal o vertical con un tope de 8 px en cada extremo y, opcionalmente, su
 * letra en (`lx`, `ly`).
 */
export const CotaSvg = ({
  x1,
  y1,
  x2,
  y2,
  letra,
  lx,
  ly,
}: Segmento & { letra?: ReactNode; lx?: number; ly?: number }) => {
  const vertical = x1 === x2
  const tope = (x: number, y: number) =>
    vertical ? { x1: x - 4, y1: y, x2: x + 4, y2: y } : { x1: x, y1: y - 4, x2: x, y2: y + 4 }
  return (
    <>
      <Linea x1={x1} y1={y1} x2={x2} y2={y2} />
      <Linea {...tope(x1, y1)} />
      <Linea {...tope(x2, y2)} />
      {letra !== undefined && lx !== undefined && ly !== undefined && (
        <Etiqueta x={lx} y={ly}>
          {letra}
        </Etiqueta>
      )}
    </>
  )
}

export default Diagrama
