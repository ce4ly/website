import { CajaTabla, Tabla } from '../referencia/TablaReferencia'
import { filaClass, tdClass } from '../referencia/estilos'
import Encabezado from '../partials/Encabezado'

const CODIGOS_Q = [
  { codigo: 'QRA', significado: '¿Cuál es el nombre de su estación?' },
  { codigo: 'QRB', significado: '¿A qué distancia está de mi estación?' },
  { codigo: 'QRG', significado: '¿Me indica mi frecuencia exacta?' },
  { codigo: 'QRH', significado: '¿Varía mi frecuencia?' },
  { codigo: 'QRI', significado: '¿Cómo es el tono de mi transmisión?' },
  { codigo: 'QRJ', significado: '¿Me recibe mal?' },
  { codigo: 'QRK', significado: '¿Cuál es la legibilidad de mis señales?' },
  { codigo: 'QRL', significado: '¿Está ocupado?' },
  { codigo: 'QRM', significado: '¿Tiene interferencias?' },
  { codigo: 'QRN', significado: '¿Le molesta la estática?' },
  { codigo: 'QRO', significado: '¿Debo aumentar la potencia?' },
  { codigo: 'QRP', significado: '¿Debo disminuir la potencia?' },
  { codigo: 'QRQ', significado: '¿Debo enviar más rápido?' },
  { codigo: 'QRS', significado: '¿Debo enviar más lento?' },
  { codigo: 'QRT', significado: '¿Debo dejar de transmitir?' },
  { codigo: 'QRU', significado: '¿Tiene algo para mí?' },
  { codigo: 'QRV', significado: '¿Está listo?' },
  { codigo: 'QRW', significado: '¿Debo informar a ___ que le llama?' },
  { codigo: 'QRX', significado: '¿Cuándo volverá a llamarme?' },
  { codigo: 'QRZ', significado: '¿Quién me llama?' },
  { codigo: 'QSA', significado: '¿Cuál es la intensidad de mis señales?' },
  { codigo: 'QSB', significado: '¿Mis señales se desvanecen?' },
  { codigo: 'QSD', significado: '¿Está defectuosa mi manipulación?' },
  { codigo: 'QSG', significado: '¿Debo enviar ___ mensajes a la vez?' },
  { codigo: 'QSK', significado: '¿Puede escucharme entre sus señales?' },
  { codigo: 'QSL', significado: '¿Puede acusar recibo?' },
  { codigo: 'QSM', significado: '¿Debo repetir el último mensaje?' },
  { codigo: 'QSN', significado: '¿Me escuchó en ___ kHz?' },
  { codigo: 'QSO', significado: '¿Puede comunicarse con ___ directamente?' },
  { codigo: 'QSP', significado: '¿Puede retransmitir a ___?' },
  {
    codigo: 'QST',
    significado: 'Llamada general a todos los radioaficionados',
  },
  { codigo: 'QSU', significado: '¿Debo transmitir en esta frecuencia?' },
  { codigo: 'QSW', significado: '¿Transmitirá en esta frecuencia?' },
  { codigo: 'QSX', significado: '¿Escuchará a ___ en ___ kHz?' },
  { codigo: 'QSY', significado: '¿Debo cambiar de frecuencia?' },
  { codigo: 'QSZ', significado: '¿Debo enviar cada palabra dos veces?' },
  { codigo: 'QTA', significado: '¿Debo cancelar el mensaje número ___?' },
  { codigo: 'QTB', significado: '¿Está de acuerdo con mi conteo de palabras?' },
  { codigo: 'QTC', significado: '¿Cuántos mensajes tiene para enviar?' },
  { codigo: 'QTH', significado: '¿Cuál es su ubicación?' },
  { codigo: 'QTR', significado: '¿Cuál es la hora correcta?' },
  { codigo: 'QTX', significado: '¿Mantendrá su estación abierta?' },
  { codigo: 'QUA', significado: '¿Tiene noticias de ___?' },
  {
    codigo: 'QUC',
    significado: '¿Cuál es el número del último mensaje que recibió?',
  },
]

const CodigoQ = () => (
  <section className='mb-16 space-y-8'>
    <Encabezado titulo='Códigos Q'>
      Los códigos Q son abreviaturas estandarizadas usadas en radiocomunicaciones para formular
      preguntas y respuestas de forma breve y universal, independiente del idioma. No son un
      requerimiento para comunicaciones por modo de fonía, pero siempre es bueno tenerlas a mano.
    </Encabezado>

    <CajaTabla className='mx-auto max-w-3xl'>
      <Tabla columnas={['Código', 'Significado']}>
        {CODIGOS_Q.map(({ codigo, significado }) => (
          <tr key={codigo} className={filaClass()}>
            <td className={`${tdClass} w-24 font-mono font-semibold`}>{codigo}</td>
            <td className={tdClass}>{significado}</td>
          </tr>
        ))}
      </Tabla>
    </CajaTabla>
  </section>
)

export default CodigoQ
