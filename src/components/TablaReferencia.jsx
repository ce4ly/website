import { inputClass, labelClass } from '../lib/calculadoras.js'

export const thClass =
  'border-b border-stone-300 bg-stone-50 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-700 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-100'

export const tdClass =
  'border-b border-stone-200 px-3 py-3 text-stone-800 dark:border-indigo-900/60 dark:text-indigo-100'

export const filaClass = destacar =>
  [
    'transition-colors hover:bg-stone-50 dark:hover:bg-indigo-950/30',
    destacar ? 'bg-amber-50/90 dark:bg-amber-950/25' : ''
  ].join(' ')

export const fmtFreq = (valor, decimales = 3, unidad = 'MHz') =>
  `${valor.toLocaleString('es-CL', {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales
  })} ${unidad}`

export const EncabezadoReferencia = ({ titulo, children }) => (
  <header className="space-y-3 text-center">
    <h1 className="text-3xl font-serif font-semibold tracking-tight text-stone-900 sm:text-4xl dark:text-white">
      {titulo}
    </h1>
    <p className="mx-auto max-w-3xl text-sm text-stone-700 sm:text-base dark:text-indigo-100">
      {children}
    </p>
  </header>
)

export const CajaTabla = ({ children, className = 'mx-auto max-w-4xl' }) => (
  <div
    className={`${className} overflow-hidden rounded-xl border border-stone-300/70 bg-white shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40`}
  >
    <div className="overflow-x-auto">{children}</div>
  </div>
)

export const NotaFuente = ({ children }) => (
  <p className="mx-auto max-w-3xl text-center text-xs text-stone-500 dark:text-indigo-300/80">
    {children}
  </p>
)

export const FiltroReferencia = ({
  id,
  label,
  placeholder,
  value,
  onChange
}) => (
  <div className="mx-auto max-w-4xl">
    <label htmlFor={id} className={labelClass}>
      {label}
    </label>
    <input
      id={id}
      className={inputClass}
      type="search"
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </div>
)
