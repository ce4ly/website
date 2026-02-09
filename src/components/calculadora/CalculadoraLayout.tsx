import type { ReactNode } from 'react'

import Encabezado from '../partials/Encabezado'
import { TARJETA } from '../partials/estilos'

type Hijos = { children?: ReactNode }

type CalculadoraLayoutProps = Hijos & {
  titulo: ReactNode
  intro: ReactNode
  /** Ancho de la columna de contenido (`max-w-3xl` por defecto). */
  ancho?: string
}

const CalculadoraLayout = ({
  titulo,
  intro,
  ancho = 'max-w-3xl',
  children,
}: CalculadoraLayoutProps) => (
  <section className='mb-16 space-y-8'>
    <Encabezado titulo={titulo}>{intro}</Encabezado>
    <div className={`mx-auto ${ancho} space-y-6`}>{children}</div>
  </section>
)

export const Articulo = ({ titulo, children }: Hijos & { titulo?: ReactNode }) => (
  <article className={`${TARJETA} space-y-4 p-6 text-sm text-stone-700 dark:text-indigo-100`}>
    {titulo && (
      <h2 className='text-lg font-serif font-semibold text-stone-900 dark:text-white'>{titulo}</h2>
    )}
    {children}
  </article>
)

type FilaProps = {
  etiqueta: ReactNode
  valor: ReactNode
  /** Separa la fila de las anteriores con una línea (resultado principal o aviso). */
  resaltar?: boolean
  /** Clases del valor, si no es el texto por defecto. */
  claseValor?: string
}

export const Fila = ({ etiqueta, valor, resaltar = false, claseValor }: FilaProps) => (
  <div
    className={`flex justify-between gap-4 ${
      resaltar ? 'border-t border-stone-200 pt-3 dark:border-indigo-900' : ''
    }`}
  >
    <dt className='text-stone-600 dark:text-indigo-300'>{etiqueta}</dt>
    <dd className={claseValor ?? 'font-mono font-semibold text-stone-900 dark:text-white'}>
      {valor}
    </dd>
  </div>
)

/** Tarjeta con una lista de `<Fila>`; `pie` va debajo, fuera de la lista. `titulo={null}`: sin título. */
export const Resultado = ({
  titulo = 'Dimensiones calculadas',
  pie,
  children,
}: Hijos & { titulo?: ReactNode | null; pie?: ReactNode }) => (
  <div className={`${TARJETA} p-6`}>
    {titulo !== null && (
      <h2 className='mb-4 text-lg font-serif font-semibold text-stone-900 dark:text-white'>
        {titulo}
      </h2>
    )}
    <dl className='space-y-3 text-sm'>{children}</dl>
    {pie}
  </div>
)

export const Formula = ({ children }: Hijos) => (
  <div className='space-y-2 rounded-lg bg-stone-50 px-4 py-3 text-center font-mono text-sm text-stone-900 dark:bg-indigo-950/60 dark:text-indigo-100'>
    {children}
  </div>
)

export const Nota = ({ children }: Hijos) => (
  <p className='text-justify text-xs text-stone-500 dark:text-indigo-300/80'>{children}</p>
)

/** Tarjeta de los campos de entrada. */
export const Campo = ({ children }: Hijos) => (
  <div className={`${TARJETA} space-y-5 p-6`}>{children}</div>
)

/** Letra de una medida, la misma que aparece en el diagrama. */
export const Cota = ({ letra, children }: Hijos & { letra: ReactNode }) => (
  <>
    <span className='mr-1.5 font-serif font-semibold text-stone-900 dark:text-white'>{letra}</span>
    {children}
  </>
)

/** Ejemplo de uso al pie de los convertidores. */
export const Ejemplo = ({ children }: Hijos) => (
  <p className='text-center text-xs text-stone-500 dark:text-indigo-300/80'>{children}</p>
)

/** Aviso centrado bajo los campos (frecuencia fuera de rango, datos incompletos…). */
export const Aviso = ({ children }: Hijos) => (
  <p className='text-center text-sm text-stone-500 dark:text-indigo-300/80'>{children}</p>
)

export default CalculadoraLayout
