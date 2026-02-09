import { useQueryState } from '../../hooks/useQueryState'
import { BANDAS_HILO, largoContrapeso, rankearLargos } from '../../lib/calc/hilo-largo'
import { formatearLongitud, formatearNumero, parseNumero } from '../../lib/calculadoras'
import CalculadoraLayout, {
  Articulo,
  Campo,
  Fila,
  Nota,
  Resultado,
} from '../calculadora/CalculadoraLayout'
import { CampoNumero, labelClass } from '../calculadora/Campos'

const DEFAULTS = {
  bandas: '80,40,20,15,10',
  lmin: '12',
  lmax: '40',
  paso: '0,1',
}

const HiloLargo = () => {
  const [q, setQ] = useQueryState(DEFAULTS)
  const ids = q.bandas.split(',').filter(Boolean)
  const ranking = rankearLargos({
    bandasIds: ids,
    lMin: parseNumero(q.lmin) ?? 12,
    lMax: parseNumero(q.lmax) ?? 40,
    paso: parseNumero(q.paso) ?? 0.1,
    top: 8,
  })
  const contrapeso = largoContrapeso(ids)

  const alternarBanda = (id: string) => {
    const marcadas = new Set(ids)
    if (marcadas.has(id)) marcadas.delete(id)
    else marcadas.add(id)
    // Se guardan en el orden de BANDAS_HILO para que la URL no dependa del orden de los clics.
    setQ({
      bandas: BANDAS_HILO.map((b) => b.id)
        .filter((x) => marcadas.has(x))
        .join(','),
    })
  }

  return (
    <CalculadoraLayout
      titulo='Hilo Largo con Unun 9:1'
      intro='A diferencia de la EFHW, aquí el hilo se elige a propósito lejos de cualquier múltiplo de media onda en las bandas marcadas.'
    >
      <Articulo titulo='No resonante a propósito'>
        <p className='text-justify'>
          Un unun 9:1 espera una impedancia de unos cientos de ohmios, no un múltiplo de media onda
          (alta impedancia extrema). Se barren largos candidatos y se ordenan por el margen mínimo a
          las zonas prohibidas.
        </p>
        <Nota>
          Son puntos de partida. Recorte con analizador o medidor de ROE. Un choque de corriente en
          el coaxial limita la RF en el chasis: el unun no aísla el equipo.
        </Nota>
      </Articulo>
      <Campo>
        <fieldset>
          <legend className={labelClass}>Bandas a cubrir</legend>
          <div className='mt-2 flex flex-wrap gap-2'>
            {BANDAS_HILO.map((b) => (
              <label
                key={b.id}
                className='inline-flex items-center gap-1 text-sm text-stone-700 dark:text-indigo-100'
              >
                <input
                  type='checkbox'
                  checked={ids.includes(b.id)}
                  onChange={() => alternarBanda(b.id)}
                />
                {b.nombre}
              </label>
            ))}
          </div>
        </fieldset>
        <div className='mt-4 grid gap-4 sm:grid-cols-3'>
          <CampoNumero
            id='lmin'
            etiqueta='Largo mínimo (m)'
            value={q.lmin}
            onChange={(lmin) => setQ({ lmin })}
          />
          <CampoNumero
            id='lmax'
            etiqueta='Largo máximo (m)'
            value={q.lmax}
            onChange={(lmax) => setQ({ lmax })}
          />
          <CampoNumero
            id='paso'
            etiqueta='Paso (m)'
            value={q.paso}
            onChange={(paso) => setQ({ paso })}
          />
        </div>
      </Campo>
      {ranking.length > 0 && (
        <Resultado
          titulo='Mejores largos'
          pie={
            <Nota>
              El contrapeso corto no reemplaza un plano de tierra. Si sientes RF en el micrófono o
              en el chasis, alarga el contrapeso, baja potencia y agrega un choque.
            </Nota>
          }
        >
          {ranking.map((c, i) => (
            <Fila
              key={c.largo}
              etiqueta={`${i + 1}. ${formatearLongitud(c.largo)}`}
              valor={`margen ${formatearNumero(c.margen, 2)} m`}
              resaltar={i === 0}
            />
          ))}
          {contrapeso !== null && (
            <Fila
              etiqueta='Contrapeso (~0,05 λ de la banda más baja)'
              valor={formatearLongitud(contrapeso)}
            />
          )}
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default HiloLargo
