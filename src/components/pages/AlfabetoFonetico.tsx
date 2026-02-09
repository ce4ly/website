import { CajaTabla, Tabla } from '../referencia/TablaReferencia'
import { filaClass, tdClass } from '../referencia/estilos'
import Encabezado from '../partials/Encabezado'

const ALFABETO_NATO = [
  { letra: 'A', palabra: 'Alpha' },
  { letra: 'B', palabra: 'Bravo' },
  { letra: 'C', palabra: 'Charlie' },
  { letra: 'D', palabra: 'Delta' },
  { letra: 'E', palabra: 'Echo' },
  { letra: 'F', palabra: 'Foxtrot' },
  { letra: 'G', palabra: 'Golf' },
  { letra: 'H', palabra: 'Hotel' },
  { letra: 'I', palabra: 'India' },
  { letra: 'J', palabra: 'Juliett' },
  { letra: 'K', palabra: 'Kilo' },
  { letra: 'L', palabra: 'Lima' },
  { letra: 'M', palabra: 'Mike' },
  { letra: 'N', palabra: 'November' },
  { letra: 'O', palabra: 'Oscar' },
  { letra: 'P', palabra: 'Papa' },
  { letra: 'Q', palabra: 'Quebec' },
  { letra: 'R', palabra: 'Romeo' },
  { letra: 'S', palabra: 'Sierra' },
  { letra: 'T', palabra: 'Tango' },
  { letra: 'U', palabra: 'Uniform' },
  { letra: 'V', palabra: 'Victor' },
  { letra: 'W', palabra: 'Whiskey' },
  { letra: 'X', palabra: 'X-ray' },
  { letra: 'Y', palabra: 'Yankee' },
  { letra: 'Z', palabra: 'Zulu' },
]

const AlfabetoFonetico = () => (
  <section className='mb-16 space-y-8'>
    <Encabezado titulo='Alfabeto Fonético OTAN'>
      Tabla de referencia del alfabeto fonético internacional (ICAO/OTAN), usado en
      radiocomunicaciones para deletrear letras con claridad y evitar confusiones.
    </Encabezado>

    <CajaTabla className='mx-auto max-w-2xl'>
      <Tabla columnas={['Letra', 'Palabra fonética']}>
        {ALFABETO_NATO.map(({ letra, palabra }) => (
          <tr key={letra} className={filaClass()}>
            <td className={`${tdClass} font-mono font-semibold`}>{letra}</td>
            <td className={tdClass}>{palabra}</td>
          </tr>
        ))}
      </Tabla>
    </CajaTabla>
  </section>
)

export default AlfabetoFonetico
