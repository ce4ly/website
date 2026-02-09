import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'

export const inputClass =
  'mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 font-mono text-sm text-stone-900 shadow-sm placeholder:text-stone-400 focus:border-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-950/20 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-white dark:placeholder:text-indigo-400 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/25'

export const labelClass = 'block text-sm font-medium text-stone-800 dark:text-indigo-100'

type CampoNumeroProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'id' | 'value' | 'onChange' | 'className'
> & {
  id: string
  etiqueta: ReactNode
  value: string
  /** Recibe el texto tal cual; se interpreta con `parseNumero` (coma o punto decimal). */
  onChange: (valor: string) => void
  /** Texto de ayuda bajo el campo. */
  ayuda?: ReactNode
  /** Controles extra bajo el campo (p. ej. los botones de las repetidoras del club). */
  children?: ReactNode
}

/** Campo numérico con su etiqueta. Es de texto para aceptar coma decimal («146,380»). */
export const CampoNumero = ({
  id,
  etiqueta,
  onChange,
  ayuda,
  children,
  ...input
}: CampoNumeroProps) => (
  <div>
    <label htmlFor={id} className={labelClass}>
      {etiqueta}
    </label>
    <input
      id={id}
      type='text'
      inputMode='decimal'
      className={inputClass}
      {...input}
      onChange={(e) => onChange(e.target.value)}
    />
    {children}
    {ayuda && <p className='mt-1 text-xs text-stone-500 dark:text-indigo-300/80'>{ayuda}</p>}
  </div>
)

type SelectorProps<T extends string> = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'id' | 'value' | 'onChange' | 'className'
> & {
  id: string
  etiqueta: ReactNode
  value: T
  onChange: (valor: T) => void
  opciones: readonly { value: T; label: ReactNode }[]
}

export const Selector = <T extends string>({
  id,
  etiqueta,
  value,
  onChange,
  opciones,
  ...select
}: SelectorProps<T>) => (
  <div>
    <label htmlFor={id} className={labelClass}>
      {etiqueta}
    </label>
    <select
      id={id}
      className={inputClass}
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      {...select}
    >
      {opciones.map((opcion) => (
        <option key={opcion.value} value={opcion.value}>
          {opcion.label}
        </option>
      ))}
    </select>
  </div>
)
