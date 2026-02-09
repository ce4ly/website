import { useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'

import { useJson } from '../../hooks/useJson'
import { useOperativo } from '../../hooks/useOperativo'
import { LISTADO_URL, type Licencia, type Listado } from '../../lib/licencias'
import {
  buscarPorLetras,
  esCoincidenciaExacta,
  fechaLegible,
  horaCorta,
  hoyEnChile,
  iniciarOperativo,
  nombreArchivoReporte,
  quitarEstacion,
  registrarEstacion,
  reporteTxt,
  terminarOperativo,
  type Estacion,
  type Operativo,
} from '../../lib/operativo'
import { esIndicativo } from '../../lib/socios'
import CalculadoraLayout, { Articulo, Aviso, Campo, Nota } from '../calculadora/CalculadoraLayout'
import { inputClass, labelClass } from '../calculadora/Campos'
import { TARJETA, botonClass, botonSecundarioClass } from '../partials/estilos'
import { tdClass } from '../referencia/estilos'
import { CajaTabla, Tabla } from '../referencia/TablaReferencia'

/** Resultados que se muestran al buscar (el resto se acota escribiendo más letras). */
const MAX_RESULTADOS = 12

const descargarReporte = (operativo: Operativo) => {
  const url = URL.createObjectURL(new Blob([reporteTxt(operativo)], { type: 'text/plain' }))
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = nombreArchivoReporte(operativo)
  enlace.click()
  URL.revokeObjectURL(url)
}

const IniciarOperativo = ({
  onIniciar,
}: {
  onIniciar: (nombre: string, fecha: string) => void
}) => {
  const [nombre, setNombre] = useState('')
  const [fecha, setFecha] = useState(hoyEnChile)

  const enviar = (e: FormEvent) => {
    e.preventDefault()
    if (nombre.trim()) onIniciar(nombre, fecha || hoyEnChile())
  }

  return (
    <form onSubmit={enviar} className={`${TARJETA} space-y-5 p-6`}>
      <div>
        <label htmlFor='op-nombre' className={labelClass}>
          Nombre del operativo
        </label>
        <input
          id='op-nombre'
          className={`${inputClass} font-sans`}
          placeholder='Ej: Ejercicio regional de emergencia'
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor='op-fecha' className={labelClass}>
          Fecha
        </label>
        <input
          id='op-fecha'
          type='date'
          className={inputClass}
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />
      </div>
      <button type='submit' className={`${botonClass} w-full`}>
        Iniciar Operativo
      </button>
    </form>
  )
}

const Resumen = ({ operativo }: { operativo: Operativo }) => (
  <dl className='grid gap-3 text-sm sm:grid-cols-4'>
    {[
      ['Operativo', operativo.nombre],
      ['Fecha', fechaLegible(operativo.fecha)],
      [
        'Horario',
        `${horaCorta(operativo.inicio)} – ${operativo.fin ? horaCorta(operativo.fin) : 'en curso'}`,
      ],
      ['Estaciones', String(operativo.registros.length)],
    ].map(([etiqueta, valor]) => (
      <div key={etiqueta}>
        <dt className='text-xs text-stone-500 dark:text-indigo-300'>{etiqueta}</dt>
        <dd className='font-semibold text-stone-900 dark:text-white'>{valor}</dd>
      </div>
    ))}
  </dl>
)

const Busqueda = ({
  licencias,
  operativo,
  onRegistrar,
}: {
  licencias: readonly Licencia[]
  operativo: Operativo
  onRegistrar: (estacion: Estacion) => void
}) => {
  const [letras, setLetras] = useState('')
  // Fila elegida con ↑/↓; se reinicia sola al cambiar lo escrito (va asociada a `letras`).
  const [seleccion, setSeleccion] = useState({ letras: '', indice: -1 })
  const [nombreManual, setNombreManual] = useState('')
  const campo = useRef<HTMLInputElement>(null)
  const campoNombre = useRef<HTMLInputElement>(null)
  const resultados = useMemo(() => buscarPorLetras(licencias, letras), [licencias, letras])
  const horaDe = new Map(operativo.registros.map((r) => [r.indicativo, horaCorta(r.hora)]))
  const manual = letras.trim().toUpperCase()
  const ofrecerManual =
    esIndicativo(manual) && !resultados.some((l) => l.indicativo === manual) && !horaDe.has(manual)
  const visibles = resultados.slice(0, MAX_RESULTADOS)

  /** Filas que se pueden elegir con el teclado: las pendientes, más la de «no figura». */
  const opciones: (Licencia | 'manual')[] = [
    ...visibles.filter((l) => !horaDe.has(l.indicativo)),
    ...(ofrecerManual ? (['manual'] as const) : []),
  ]
  const indice = seleccion.letras === letras ? Math.min(seleccion.indice, opciones.length - 1) : -1
  const elegida = indice >= 0 ? opciones[indice] : undefined
  const idOpcion = (opcion: Licencia | 'manual') =>
    `op-opcion-${opcion === 'manual' ? manual : opcion.indicativo}`

  const registrar = (estacion: Estacion) => {
    onRegistrar(estacion)
    setLetras('')
    setSeleccion({ letras: '', indice: -1 })
    setNombreManual('')
    campo.current?.focus()
  }

  const elegir = (opcion: Licencia | 'manual') =>
    opcion === 'manual' ? campoNombre.current?.focus() : registrar(opcion)

  // Enter registra la fila elegida con ↑/↓. Sin elección, solo una coincidencia exacta única: con
  // varias, o solo parciales («LY» → CA7LYO), el operador elige. Si el indicativo no figura en
  // SUBTEL, Enter pasa al campo del nombre.
  const exactas = resultados.filter(
    (l) => esCoincidenciaExacta(l, letras) && !horaDe.has(l.indicativo),
  )
  const enviar = (e: FormEvent) => {
    e.preventDefault()
    if (elegida) elegir(elegida)
    else if (exactas.length === 1) registrar(exactas[0])
    else if (ofrecerManual) campoNombre.current?.focus()
  }

  const mover = (paso: number) => {
    if (opciones.length === 0) return
    const siguiente = Math.max(-1, Math.min(opciones.length - 1, indice + paso))
    setSeleccion({ letras, indice: siguiente })
    if (siguiente >= 0) {
      const id = idOpcion(opciones[siguiente])
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'nearest' }))
    }
  }

  const teclas = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      mover(e.key === 'ArrowDown' ? 1 : -1)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      if (indice >= 0) setSeleccion({ letras, indice: -1 })
      else setLetras('')
    }
  }

  /** Clases de una fila: resaltada si es la elegida con el teclado. */
  const claseFila = (opcion: Licencia | 'manual') =>
    elegida === opcion
      ? 'bg-sky-100 ring-2 ring-inset ring-sky-400 dark:bg-indigo-800/60 dark:ring-indigo-400'
      : ''

  const registrarManual = (e: FormEvent) => {
    e.preventDefault()
    registrar({ indicativo: manual, nombre: nombreManual, noRegistrado: true })
  }

  return (
    <div className='space-y-4'>
      <form onSubmit={enviar}>
        <label htmlFor='op-letras' className={labelClass}>
          Letras del indicativo
        </label>
        <input
          ref={campo}
          id='op-letras'
          className={`${inputClass} uppercase`}
          placeholder='Ej: NFS, LY, CHP…'
          autoComplete='off'
          autoCapitalize='characters'
          spellCheck={false}
          value={letras}
          onChange={(e) => setLetras(e.target.value)}
          onKeyDown={teclas}
          role='combobox'
          aria-expanded={letras.trim() !== ''}
          aria-controls='op-resultados'
          aria-activedescendant={elegida ? idOpcion(elegida) : undefined}
        />
        <p className='mt-1 text-xs text-stone-500 dark:text-indigo-300/80'>
          Escriba las letras después del número (CA5<strong>NFS</strong>); si escuchó solo partes,
          sepárelas con espacios (<strong>5 FS</strong>). Elija con ↑ y ↓ y registre con Enter; sin
          elegir, Enter registra solo si la coincidencia exacta es única. Esc limpia.
        </p>
      </form>

      {letras.trim() && (
        <CajaTabla className='w-full'>
          <Tabla columnas={['Indicativo', 'Nombre', 'Comuna', '']} id='op-resultados'>
            {visibles.map((l) => {
              const hora = horaDe.get(l.indicativo)
              return (
                <tr
                  key={l.indicativo}
                  id={idOpcion(l)}
                  className={claseFila(l)}
                  aria-selected={elegida === l}
                >
                  <td className={`${tdClass} font-mono font-semibold`}>{l.indicativo}</td>
                  <td className={tdClass}>{l.nombre}</td>
                  <td className={tdClass}>{l.comuna}</td>
                  <td className={`${tdClass} text-right`}>
                    {hora ? (
                      <span className='whitespace-nowrap text-xs font-medium text-green-700 dark:text-green-400'>
                        Presente {hora}
                      </span>
                    ) : (
                      <button
                        type='button'
                        className={botonSecundarioClass}
                        onClick={() => registrar(l)}
                      >
                        Registrar
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
            {ofrecerManual && (
              <tr
                id={idOpcion('manual')}
                className={claseFila('manual')}
                aria-selected={elegida === 'manual'}
              >
                <td className={`${tdClass} font-mono font-semibold`}>{manual}</td>
                <td colSpan={3} className={tdClass}>
                  {/* SUBTEL actualiza el listado cada seis meses: una licencia nueva puede no estar. */}
                  <form onSubmit={registrarManual} className='flex flex-wrap items-end gap-2'>
                    <label className='min-w-48 flex-1 text-xs text-stone-500 dark:text-indigo-300/80'>
                      No figura en el listado de SUBTEL. Nombre:
                      <input
                        ref={campoNombre}
                        className={`${inputClass} font-sans`}
                        placeholder='Nombre que indica la estación'
                        autoComplete='off'
                        value={nombreManual}
                        onChange={(e) => setNombreManual(e.target.value)}
                      />
                    </label>
                    <button type='submit' className={botonSecundarioClass}>
                      Registrar
                    </button>
                  </form>
                </td>
              </tr>
            )}
            {resultados.length === 0 && !ofrecerManual && (
              <tr>
                <td colSpan={4} className={`${tdClass} text-center text-stone-500`}>
                  Sin coincidencias. Si la estación no figura en SUBTEL, escriba el indicativo
                  completo para registrarla con su nombre.
                </td>
              </tr>
            )}
          </Tabla>
          {resultados.length > MAX_RESULTADOS && (
            <p className={`${tdClass} border-b-0 text-xs text-stone-500`}>
              {resultados.length - MAX_RESULTADOS} resultados más: escriba más letras para acotar.
            </p>
          )}
        </CajaTabla>
      )}
    </div>
  )
}

const ListaPresentes = ({
  operativo,
  onQuitar,
}: {
  operativo: Operativo
  onQuitar?: (indicativo: string) => void
}) =>
  operativo.registros.length === 0 ? (
    <Aviso>Aún no se ha registrado ninguna estación.</Aviso>
  ) : (
    <CajaTabla className='w-full'>
      <Tabla columnas={['N°', 'Hora', 'Indicativo', 'Nombre', ...(onQuitar ? [''] : [])]}>
        {operativo.registros
          .map((r, i) => ({ ...r, n: i + 1 }))
          .reverse()
          .map((r) => (
            <tr key={r.indicativo}>
              <td className={`${tdClass} font-mono`}>{r.n}</td>
              <td className={`${tdClass} font-mono`}>{horaCorta(r.hora)}</td>
              <td className={`${tdClass} font-mono font-semibold`}>{r.indicativo}</td>
              <td className={tdClass}>
                {r.nombre}
                {r.noRegistrado && (
                  <span className='ml-1 text-xs italic text-stone-500 dark:text-indigo-300/80'>
                    (no registrado)
                  </span>
                )}
              </td>
              {onQuitar && (
                <td className={`${tdClass} text-right`}>
                  <button
                    type='button'
                    className='text-xs font-medium text-red-700 underline underline-offset-2 hover:text-red-900 dark:text-red-400'
                    onClick={() => onQuitar(r.indicativo)}
                  >
                    Quitar
                  </button>
                </td>
              )}
            </tr>
          ))}
      </Tabla>
    </CajaTabla>
  )

const ControlOperativo = () => {
  const { operativo, guardar, actualizar } = useOperativo()
  const listado = useJson<Partial<Listado>>(LISTADO_URL)
  const licencias = listado.tipo === 'ok' ? (listado.datos.licencias ?? []) : []

  const terminar = () => {
    if (window.confirm('¿Terminar el operativo? Ya no se podrán registrar estaciones.')) {
      actualizar((op) => terminarOperativo(op))
    }
  }

  const nuevo = () => {
    if (window.confirm('¿Empezar otro operativo? Se borrará el registro del anterior.')) {
      guardar(null)
    }
  }

  return (
    <CalculadoraLayout
      titulo='Control de Operativo'
      intro='Registro de las estaciones que se reportan durante un operativo de radioaficionados: busque cada indicativo por sus letras y descargue el reporte al terminar.'
      ancho='max-w-4xl'
    >
      {operativo === undefined && <Aviso>Cargando…</Aviso>}

      {operativo === null && (
        <>
          <Articulo titulo='Cómo funciona'>
            <p className='text-justify'>
              Inicie el operativo con su nombre y fecha. A medida que las estaciones se reportan,
              escriba las letras de su indicativo y regístrelas: queda anotada la hora. El registro
              se guarda en este navegador, así que sobrevive a una recarga o a un corte de red. Al
              terminar, descargue el reporte en texto plano.
            </p>
          </Articulo>
          <IniciarOperativo
            onIniciar={(nombre, fecha) => guardar(iniciarOperativo(nombre, fecha))}
          />
        </>
      )}

      {operativo && (
        <>
          <Campo>
            <Resumen operativo={operativo} />
            <div className='flex flex-wrap gap-2'>
              <button
                type='button'
                className={botonSecundarioClass}
                onClick={() => descargarReporte(operativo)}
                disabled={operativo.registros.length === 0}
              >
                Descargar reporte (.txt)
              </button>
              {operativo.fin ? (
                <button type='button' className={botonSecundarioClass} onClick={nuevo}>
                  Nuevo operativo
                </button>
              ) : (
                <button type='button' className={botonClass} onClick={terminar}>
                  Terminar Operativo
                </button>
              )}
            </div>
          </Campo>

          {!operativo.fin &&
            (listado.tipo === 'error' ? (
              <Nota>
                No se pudo cargar el listado de SUBTEL: registre las estaciones escribiendo el
                indicativo completo.
              </Nota>
            ) : (
              <Busqueda
                licencias={licencias}
                operativo={operativo}
                onRegistrar={(estacion) => actualizar((op) => registrarEstacion(op, estacion))}
              />
            ))}

          <h2 className='text-lg font-serif font-semibold text-stone-900 dark:text-white'>
            Estaciones presentes ({operativo.registros.length})
          </h2>
          <ListaPresentes
            operativo={operativo}
            onQuitar={
              operativo.fin
                ? undefined
                : (indicativo) => actualizar((op) => quitarEstacion(op, indicativo))
            }
          />
        </>
      )}
    </CalculadoraLayout>
  )
}

export default ControlOperativo
