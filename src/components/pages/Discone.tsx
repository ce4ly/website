import { useQueryState } from '../../hooks/useQueryState'
import { discone, type DimensionDiscone } from '../../lib/calc/discone'
import { esPositivo, formatearLongitud, formatearNumero, parseNumero } from '../../lib/calculadoras'
import CalculadoraLayout, {
  Articulo,
  Campo,
  Fila,
  Formula,
  Nota,
  Resultado,
} from '../calculadora/CalculadoraLayout'
import { CampoNumero } from '../calculadora/Campos'

const DEFAULTS = { fmin: '100' }

/** «nominal (mín – máx)», en metros/centímetros o en grados y unidades. */
const rango = (dim: DimensionDiscone) => {
  if (dim.unidad === 'm') {
    return `${formatearLongitud(dim.nominal)} (${formatearLongitud(dim.min)} – ${formatearLongitud(dim.max)})`
  }
  return `${formatearNumero(dim.nominal, 0)} ${dim.unidad} (${formatearNumero(dim.min, 0)}–${formatearNumero(dim.max, 0)})`.trim()
}

const Discone = () => {
  const [q, setQ] = useQueryState(DEFAULTS)
  const fmin = parseNumero(q.fmin)
  const d = esPositivo(fmin) ? discone(fmin) : null

  return (
    <CalculadoraLayout
      titulo='Calculadora de Discone'
      intro='Antena de banda ancha para escanear marinas, comerciales, emergencia y TV. Las proporciones salen de la literatura, no de un único valor mágico.'
    >
      <Articulo titulo='Referencias'>
        <p className='text-justify'>
          ARRL Antenna Book (Hall, ed.): el lado del cono vale λ/4 a la frecuencia mínima y el
          disco, 0,7 × (λ/4). Belrose, VE2CV, QST julio 1975: ángulo de cono típico 60° (30° al eje)
          y disco entre 0,64 y 0,70 del diámetro de la boca. El ancho de banda útil ronda de f a
          10·f.
        </p>
        <Formula>
          <p>Ls ≈ λ/4 &nbsp;|&nbsp; Ddisco ≈ 0,64–0,70 × Dboca &nbsp;|&nbsp; Φ ≈ 60°</p>
        </Formula>
      </Articulo>
      <Campo>
        <CampoNumero
          id='fmin'
          etiqueta='Frecuencia mínima (MHz)'
          placeholder='Ej: 100'
          value={q.fmin}
          onChange={(fmin) => setQ({ fmin })}
        />
      </Campo>
      {d && esPositivo(fmin) && (
        <Resultado
          titulo='Dimensiones (nominal y rango)'
          pie={
            <Nota>
              Recorte con analizador. Más varillas acercan el cono a una superficie continua y bajan
              un poco la frecuencia de corte.
            </Nota>
          }
        >
          <Fila etiqueta='Largo inclinado del cono' valor={rango(d.largoInclinado)} />
          <Fila etiqueta='Diámetro del disco' valor={rango(d.diametroDisco)} />
          <Fila etiqueta='Diámetro superior del cono' valor={rango(d.diametroSuperiorCono)} />
          <Fila etiqueta='Separación disco–cono' valor={rango(d.separacionDiscoCono)} />
          <Fila etiqueta='Ángulo del cono (incluido)' valor={rango(d.anguloCono)} />
          <Fila etiqueta='Número de varillas' valor={rango(d.varillas)} />
          <Fila
            etiqueta='Ancho de banda útil estimado'
            valor={`${formatearNumero(fmin, 1)} – ${formatearNumero(d.fMaxUtilMhz, 1)} MHz`}
            resaltar
          />
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default Discone
