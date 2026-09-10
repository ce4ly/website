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
    significado: 'Llamada general a todos los radioaficionados'
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
    significado: '¿Cuál es el número del último mensaje que recibió?'
  }
]

const thClass =
  'border-b border-stone-300 bg-stone-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-700 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-100'

const tdClass =
  'border-b border-stone-200 px-4 py-3 text-stone-800 dark:border-indigo-900/60 dark:text-indigo-100'

const CodigoQ = () => {
  return (
    <section className="my-16 space-y-8">
      <header className="space-y-3 text-center">
        <h1 className="text-3xl font-serif font-semibold tracking-tight text-stone-900 sm:text-4xl dark:text-white">
          Códigos Q
        </h1>
        <p className="mx-auto max-w-3xl text-sm text-stone-700 sm:text-base dark:text-indigo-100">
          Los códigos Q son abreviaturas estandarizadas usadas en
          radiocomunicaciones para formular preguntas y respuestas de forma
          breve y universal, independiente del idioma. No son un requerimiento
          para comunicaciones por modo de fonía, pero siempre es bueno tenerlas
          a mano.
        </p>
      </header>

      <div className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-stone-300/70 bg-white shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className={thClass}>Código</th>
                <th className={thClass}>Significado</th>
              </tr>
            </thead>
            <tbody>
              {CODIGOS_Q.map(({ codigo, significado }) => (
                <tr
                  key={codigo}
                  className="transition-colors hover:bg-stone-50 dark:hover:bg-indigo-950/30"
                >
                  <td className={`${tdClass} w-24 font-mono font-semibold`}>
                    {codigo}
                  </td>
                  <td className={tdClass}>{significado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default CodigoQ
