import { REPETIDORAS, formatearFrecuenciaMhz, type Repetidora } from '../../lib/repetidoras'

/** Botones para cargar la frecuencia de una repetidora del club. */
const PresetsRepetidoras = ({ onSelect }: { onSelect: (repetidora: Repetidora) => void }) => (
  <div className='mt-2 flex flex-wrap gap-2'>
    {REPETIDORAS.map((rep) => (
      <button
        key={rep.id}
        type='button'
        onClick={() => onSelect(rep)}
        className='rounded-md border border-stone-300 px-2 py-1 text-xs font-medium text-blue-950 transition-colors hover:bg-stone-50 dark:border-indigo-800 dark:text-indigo-200 dark:hover:bg-indigo-900/70'
      >
        {rep.nombre} ({formatearFrecuenciaMhz(rep.frecuenciaMhz)} MHz)
      </button>
    ))}
  </div>
)

export default PresetsRepetidoras
