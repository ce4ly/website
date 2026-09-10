const Pestanas = ({ valor, onChange, items }) => {
  return (
    <div
      role="tablist"
      className="flex flex-wrap gap-1 border-b border-stone-200 dark:border-indigo-900"
    >
      {items.map(item => {
        const activa = valor === item.id
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={activa}
            onClick={() => onChange(item.id)}
            className={[
              'rounded-t-md px-3 py-2 text-sm font-medium transition-colors',
              activa
                ? 'bg-white text-blue-950 dark:bg-indigo-950/40 dark:text-white'
                : 'text-stone-600 hover:text-blue-950 dark:text-indigo-300 dark:hover:text-indigo-100'
            ].join(' ')}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

export default Pestanas
