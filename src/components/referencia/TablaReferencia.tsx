import type { ReactNode } from 'react'

import { inputClass, labelClass } from '../calculadora/Campos'
import { TARJETA } from '../partials/estilos'
import { tdClass, thClass } from './estilos'

export const CajaTabla = ({
  children,
  className = 'mx-auto max-w-4xl',
}: {
  children: ReactNode
  className?: string
}) => (
  <div className={`${className} overflow-hidden ${TARJETA}`}>
    <div className='overflow-x-auto'>{children}</div>
  </div>
)

/** Tabla con cabecera; si no hay filas, muestra «No hay coincidencias.». */
export const Tabla = ({
  columnas,
  vacia = false,
  id,
  children,
}: {
  columnas: readonly ReactNode[]
  vacia?: boolean
  id?: string
  children: ReactNode
}) => (
  <table id={id} className='w-full text-sm'>
    <thead>
      <tr>
        {columnas.map((columna, i) => (
          <th key={i} className={thClass}>
            {columna}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {children}
      {vacia && (
        <tr>
          <td colSpan={columnas.length} className={`${tdClass} text-center text-stone-500`}>
            No hay coincidencias.
          </td>
        </tr>
      )}
    </tbody>
  </table>
)

/** Subtítulo y explicación sobre una tabla. */
export const SeccionReferencia = ({
  titulo,
  children,
  grande = false,
}: {
  titulo: ReactNode
  children: ReactNode
  /** `text-xl` en vez de `text-lg` (CTCSS, DCS y DMR). */
  grande?: boolean
}) => (
  <div className='mx-auto max-w-4xl space-y-3'>
    <h2
      className={`${grande ? 'text-xl tracking-tight' : 'text-lg'} font-serif font-semibold text-stone-900 dark:text-white`}
    >
      {titulo}
    </h2>
    <p className='text-sm text-stone-700 dark:text-indigo-100'>{children}</p>
  </div>
)

export const NotaFuente = ({ children }: { children: ReactNode }) => (
  <p className='mx-auto max-w-3xl text-center text-xs text-stone-500 dark:text-indigo-300/80'>
    {children}
  </p>
)

/** Enlace externo dentro de una `NotaFuente`. */
export const EnlaceFuente = ({ href, children }: { href: string; children: ReactNode }) => (
  <a
    href={href}
    className='underline underline-offset-2 hover:text-stone-700 dark:hover:text-indigo-100'
    target='_blank'
    rel='noopener noreferrer'
  >
    {children}
  </a>
)

export const FiltroReferencia = ({
  id,
  label,
  placeholder,
  value,
  onChange,
}: {
  id: string
  label: ReactNode
  placeholder: string
  value: string
  onChange: (valor: string) => void
}) => (
  <div className='mx-auto max-w-4xl'>
    <label htmlFor={id} className={labelClass}>
      {label}
    </label>
    <input
      id={id}
      className={inputClass}
      type='search'
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
)
