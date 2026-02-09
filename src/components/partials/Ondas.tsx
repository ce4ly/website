/** Ondas concéntricas de fondo (decorativas), como las del logo. Van sobre fondo azul. */
const Ondas = ({ className }: { className: string }) => (
  <svg
    viewBox='0 0 400 400'
    className={`pointer-events-none absolute text-white/10 ${className}`}
    aria-hidden='true'
  >
    {[60, 110, 160, 210].map((r) => (
      <circle key={r} cx='200' cy='200' r={r} fill='none' stroke='currentColor' strokeWidth='10' />
    ))}
  </svg>
)

export default Ondas
