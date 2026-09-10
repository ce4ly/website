import { useEffect, useMemo, useState } from 'react'
import {
  CajaTabla,
  EncabezadoReferencia,
  FiltroReferencia,
  NotaFuente,
  filaClass,
  tdClass,
  thClass
} from '../components/TablaReferencia.jsx'

const CATEGORIA = {
  aspirante: 'Aspirante',
  novicio: 'Novicio',
  general: 'General',
  superior: 'Superior'
}

const MAX = 80

const normalizar = texto =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '')

const parseFecha = ddmmYYYY => {
  const [d, m, y] = ddmmYYYY.split('/').map(Number)
  return new Date(y, m - 1, d)
}

const vencida = fecha => parseFecha(fecha) < new Date(new Date().toDateString())

const Buscador = () => {
  const [filtro, setFiltro] = useState('')
  const [licencias, setLicencias] = useState([])
  const [fuente, setFuente] = useState('')
  const [estado, setEstado] = useState('cargando')

  useEffect(() => {
    let vivo = true
    fetch('/data/licencias.json')
      .then(r => {
        if (!r.ok) throw new Error('No se pudo cargar el listado')
        return r.json()
      })
      .then(data => {
        if (!vivo) return
        setLicencias(data.licencias || [])
        setFuente(data.fuente || '')
        setEstado('ok')
      })
      .catch(() => {
        if (vivo) setEstado('error')
      })
    return () => {
      vivo = false
    }
  }, [])

  const consulta = normalizar(filtro.trim())
  const huevoNfs = consulta === 'nfs'
  const huevoEyt = consulta === 'eyt'

  const { resultados, total } = useMemo(() => {
    const q = normalizar(filtro.trim())
    if (q.length < 2) return { resultados: [], total: 0 }
    const hits = licencias.filter(l => {
      const ind = normalizar(l.indicativo)
      const nom = normalizar(l.nombre)
      const lic = normalizar(l.licencia)
      return ind.includes(q) || nom.includes(q) || lic.includes(q)
    })
    hits.sort((a, b) => {
      const aInd = normalizar(a.indicativo)
      const bInd = normalizar(b.indicativo)
      const aExact = aInd === q
      const bExact = bInd === q
      if (aExact !== bExact) return aExact ? -1 : 1
      const aPref = aInd.startsWith(q)
      const bPref = bInd.startsWith(q)
      if (aPref !== bPref) return aPref ? -1 : 1
      return a.indicativo.localeCompare(b.indicativo, 'es')
    })
    return { resultados: hits.slice(0, MAX), total: hits.length }
  }, [filtro, licencias])

  return (
    <section className="my-16 space-y-8">
      <EncabezadoReferencia titulo="Buscador de licencias">
        Listado de radioaficionados de Chile publicado por SUBTEL. Busque por
        nombre, indicativo o número de licencia. Un trozo alcanza: NFS encuentra
        CA5NFS.
      </EncabezadoReferencia>

      <FiltroReferencia
        id="lic-filtro"
        label="Nombre, indicativo o licencia"
        placeholder="Ej: VQX, Landaeta, 906146…"
        value={filtro}
        onChange={setFiltro}
      />

      {estado === 'cargando' && (
        <p className="text-center text-sm text-stone-500 dark:text-indigo-300/80">
          Cargando listado…
        </p>
      )}
      {estado === 'error' && (
        <p className="text-center text-sm text-red-700 dark:text-red-400">
          No se pudo cargar el listado de licencias.
        </p>
      )}

      {estado === 'ok' && filtro.trim().length < 2 && (
        <p className="text-center text-sm text-stone-500 dark:text-indigo-300/80">
          Escriba al menos dos caracteres. Hay{' '}
          {licencias.length.toLocaleString('es-CL')} licencias en el listado.
        </p>
      )}

      {estado === 'ok' && filtro.trim().length >= 2 && (
        <>
          <p className="mx-auto max-w-5xl text-sm text-stone-600 dark:text-indigo-300/80">
            {total === 0
              ? 'Sin coincidencias.'
              : `${total.toLocaleString('es-CL')} coincidencia${
                  total === 1 ? '' : 's'
                }${total > MAX ? ` (se muestran ${MAX})` : ''}.`}
          </p>
          {resultados.length > 0 && (
            <CajaTabla className="mx-auto max-w-5xl">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className={thClass}>Indicativo</th>
                    <th className={thClass}>Nombre</th>
                    <th className={thClass}>Licencia</th>
                    <th className={thClass}>Categoría</th>
                    <th className={thClass}>Comuna</th>
                    <th className={thClass}>Región</th>
                    <th className={thClass}>Vence</th>
                  </tr>
                </thead>
                <tbody>
                  {resultados.map(l => {
                    const caduca = vencida(l.vencimiento)
                    return (
                      <tr
                        key={`${l.licencia}-${l.indicativo}`}
                        className={filaClass(caduca)}
                      >
                        <td className={`${tdClass} font-mono font-semibold`}>
                          {l.indicativo}
                        </td>
                        <td className={tdClass}>
                          {l.nombre}
                          {huevoEyt &&
                            normalizar(l.nombre).includes('noziglia') && (
                              <span
                                className="ml-1 text-red-600 dark:text-red-400"
                                aria-hidden
                              >
                                ♥
                              </span>
                            )}
                        </td>
                        <td className={`${tdClass} font-mono`}>{l.licencia}</td>
                        <td className={tdClass}>
                          {CATEGORIA[l.categoria] || l.categoria}
                        </td>
                        <td className={tdClass}>{l.comuna}</td>
                        <td className={tdClass}>{l.region}</td>
                        <td
                          className={`${tdClass} font-mono ${
                            caduca ? 'text-red-700 dark:text-red-400' : ''
                          }`}
                        >
                          {l.vencimiento}
                          {caduca ? ' · vencida' : ''}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </CajaTabla>
          )}
          {huevoNfs && (
            <p className="flex justify-center pt-2">
              <img src="/nfs.webp" alt="" className="h-40 w-auto" />
            </p>
          )}
        </>
      )}

      <NotaFuente>
        {fuente || 'SUBTEL'}. No sustituye al registro oficial: las fechas
        cambian cuando se renueva o se caduca una licencia.
      </NotaFuente>
    </section>
  )
}

export default Buscador
