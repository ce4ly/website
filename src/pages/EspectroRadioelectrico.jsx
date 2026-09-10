import { Fragment } from 'react'

const CATEGORIAS = [
  {
    prefijo: 'CD',
    nombre: 'Aspirante',
    descripcion:
      'Primera categoría. HF en 80 m, 40 m y 10 m; VHF en 2 m (con restricciones de supervisión para menores de 15 años).'
  },
  {
    prefijo: 'CA',
    nombre: 'Novicio',
    descripcion:
      'Pueden operar en: 80 m, 40 m, 30 m, 10 m, 6 m, 2 m, 1¼ m, 70 cm, 23 cm, 13 cm y 5,8 cm.'
  },
  {
    prefijo: 'CE',
    nombre: 'General',
    descripcion:
      'Todas las bandas atribuidas al servicio de radioaficionados según el Plan General de Uso del Espectro Radioeléctrico.'
  },
  {
    prefijo: 'XQ',
    nombre: 'Superior',
    descripcion:
      'Todas las bandas atribuidas al servicio de radioaficionados, con facultades adicionales de experimentación.'
  }
]

const MODOS = ['CW', 'LSB', 'USB', 'AM', 'FM', 'Digital']

const formatearFreq = (valor, unidad, decimales) =>
  `${valor.toLocaleString('es-CL', {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales
  })} ${unidad}`

const formatearRango = (min, max, unidad, decimales) =>
  min === max
    ? formatearFreq(min, unidad, decimales)
    : `${formatearFreq(min, unidad, decimales).replace(` ${unidad}`, '')} – ${formatearFreq(
        max,
        unidad,
        decimales
      )}`

const modosUnicos = segmentos =>
  MODOS.filter(modo => segmentos.some(seg => seg.modos.includes(modo)))

const BANDAS = [
  {
    banda: '160 m',
    min: 1.8,
    max: 1.85,
    unidad: 'MHz',
    decimales: 3,
    cd: false,
    ca: false,
    ce: true,
    xq: true,
    segmentos: [
      { min: 1.8, max: 1.81, modos: ['Digital'] },
      { min: 1.81, max: 1.84, modos: ['CW'] },
      {
        min: 1.84,
        max: 1.85,
        modos: ['CW', 'LSB', 'AM', 'Digital'],
        nota: 'Fonía en LSB'
      }
    ]
  },
  {
    banda: '80 m',
    min: 3.5,
    max: 3.75,
    unidad: 'MHz',
    decimales: 3,
    cd: true,
    ca: true,
    ce: true,
    xq: true,
    segmentos: [
      { min: 3.5, max: 3.57, modos: ['CW'], nota: 'Ventana DX / QRS' },
      { min: 3.57, max: 3.6, modos: ['CW', 'Digital'] },
      {
        min: 3.6,
        max: 3.75,
        modos: ['CW', 'LSB', 'AM', 'Digital'],
        nota: 'Fonía en LSB; AM permitido'
      }
    ]
  },
  {
    banda: '40 m',
    min: 7.0,
    max: 7.3,
    unidad: 'MHz',
    decimales: 3,
    cd: true,
    ca: true,
    ce: true,
    xq: true,
    segmentos: [
      { min: 7.0, max: 7.04, modos: ['CW'], nota: 'Ventana DX / QRP' },
      { min: 7.04, max: 7.05, modos: ['CW', 'Digital'] },
      {
        min: 7.05,
        max: 7.3,
        modos: ['CW', 'LSB', 'AM', 'Digital'],
        nota: 'Fonía en LSB; AM permitido'
      }
    ]
  },
  {
    banda: '30 m',
    min: 10.1,
    max: 10.15,
    unidad: 'MHz',
    decimales: 3,
    cd: false,
    ca: true,
    ce: true,
    xq: true,
    segmentos: [
      { min: 10.1, max: 10.13, modos: ['CW'] },
      {
        min: 10.13,
        max: 10.15,
        modos: ['CW', 'Digital'],
        nota: 'Sin fonía (IARU R2)'
      }
    ]
  },
  {
    banda: '20 m',
    min: 14.0,
    max: 14.35,
    unidad: 'MHz',
    decimales: 3,
    cd: false,
    ca: false,
    ce: true,
    xq: true,
    segmentos: [
      { min: 14.0, max: 14.07, modos: ['CW'], nota: 'Ventana DX / QRP' },
      { min: 14.07, max: 14.099, modos: ['CW', 'Digital'] },
      {
        min: 14.099,
        max: 14.101,
        modos: ['CW'],
        nota: 'Radiofaro IBP (exclusivo)'
      },
      {
        min: 14.101,
        max: 14.35,
        modos: ['CW', 'USB', 'AM', 'Digital'],
        nota: 'Fonía en USB; AM sobre 14,285'
      }
    ]
  },
  {
    banda: '17 m',
    min: 18.068,
    max: 18.168,
    unidad: 'MHz',
    decimales: 3,
    cd: false,
    ca: false,
    ce: true,
    xq: true,
    segmentos: [
      { min: 18.068, max: 18.095, modos: ['CW'] },
      { min: 18.095, max: 18.109, modos: ['CW', 'Digital'] },
      {
        min: 18.109,
        max: 18.111,
        modos: ['CW'],
        nota: 'Radiofaro IBP (exclusivo)'
      },
      {
        min: 18.111,
        max: 18.168,
        modos: ['CW', 'USB', 'Digital'],
        nota: 'Fonía en USB'
      }
    ]
  },
  {
    banda: '15 m',
    min: 21.0,
    max: 21.45,
    unidad: 'MHz',
    decimales: 3,
    cd: false,
    ca: false,
    ce: true,
    xq: true,
    segmentos: [
      { min: 21.0, max: 21.07, modos: ['CW'] },
      { min: 21.07, max: 21.149, modos: ['CW', 'Digital'] },
      {
        min: 21.149,
        max: 21.151,
        modos: ['CW'],
        nota: 'Radiofaro IBP (exclusivo)'
      },
      {
        min: 21.151,
        max: 21.45,
        modos: ['CW', 'USB', 'AM', 'Digital'],
        nota: 'Fonía en USB'
      }
    ]
  },
  {
    banda: '12 m',
    min: 24.89,
    max: 24.99,
    unidad: 'MHz',
    decimales: 3,
    cd: false,
    ca: false,
    ce: true,
    xq: true,
    segmentos: [
      { min: 24.89, max: 24.915, modos: ['CW'] },
      { min: 24.915, max: 24.929, modos: ['CW', 'Digital'] },
      {
        min: 24.929,
        max: 24.931,
        modos: ['CW'],
        nota: 'Radiofaro IBP (exclusivo)'
      },
      {
        min: 24.931,
        max: 24.99,
        modos: ['CW', 'USB', 'Digital'],
        nota: 'Fonía en USB'
      }
    ]
  },
  {
    banda: '10 m',
    min: 28.0,
    max: 29.7,
    unidad: 'MHz',
    decimales: 3,
    cd: true,
    ca: true,
    ce: true,
    xq: true,
    segmentos: [
      { min: 28.0, max: 28.07, modos: ['CW'] },
      { min: 28.07, max: 28.19, modos: ['CW', 'Digital'] },
      {
        min: 28.19,
        max: 28.225,
        modos: ['CW'],
        nota: 'Radiofaros / IBP'
      },
      {
        min: 28.225,
        max: 29.2,
        modos: ['CW', 'USB', 'AM', 'Digital'],
        nota: 'Fonía en USB'
      },
      {
        min: 29.2,
        max: 29.51,
        modos: ['CW', 'USB', 'AM', 'Digital'],
        nota: 'AM preferente; satélite 29,300–29,510'
      },
      {
        min: 29.52,
        max: 29.7,
        modos: ['FM', 'Digital'],
        nota: 'Simplex y repetidoras; llamada 29,600'
      }
    ]
  },
  {
    banda: '6 m',
    min: 50.0,
    max: 54.0,
    unidad: 'MHz',
    decimales: 3,
    cd: false,
    ca: true,
    ce: true,
    xq: true,
    segmentos: [
      { min: 50.0, max: 50.1, modos: ['CW'], nota: 'Radiofaros' },
      {
        min: 50.1,
        max: 50.4,
        modos: ['CW', 'USB', 'Digital'],
        nota: 'Ventana DX; llamada 50,110'
      },
      {
        min: 50.4,
        max: 51.1,
        modos: ['CW', 'USB', 'AM', 'Digital']
      },
      {
        min: 51.1,
        max: 54.0,
        modos: ['CW', 'USB', 'AM', 'FM', 'Digital'],
        nota: 'FM / repetidoras en la parte alta'
      }
    ]
  },
  {
    banda: '2 m',
    min: 144.0,
    max: 148.0,
    unidad: 'MHz',
    decimales: 3,
    cd: true,
    ca: true,
    ce: true,
    xq: true,
    segmentos: [
      {
        min: 144.0,
        max: 144.4,
        modos: ['CW', 'USB', 'Digital'],
        nota: 'Señales débiles / EME; llamada 144,300'
      },
      {
        min: 144.4,
        max: 145.8,
        modos: ['FM', 'Digital'],
        nota: 'Repetidoras y simplex'
      },
      {
        min: 145.8,
        max: 146.0,
        modos: ['USB', 'Digital'],
        nota: 'Satélite (exclusivo)'
      },
      {
        min: 146.0,
        max: 148.0,
        modos: ['FM', 'Digital'],
        nota: 'Repetidoras y simplex; llamada 146,520'
      }
    ]
  },
  {
    banda: '1¼ m',
    min: 220.0,
    max: 225.0,
    unidad: 'MHz',
    decimales: 3,
    cd: false,
    ca: true,
    ce: true,
    xq: true,
    segmentos: [
      {
        min: 220.0,
        max: 222.0,
        modos: ['CW', 'USB', 'AM', 'FM', 'Digital']
      },
      {
        min: 222.0,
        max: 222.15,
        modos: ['CW', 'USB', 'Digital'],
        nota: 'Señales débiles; llamada 222,100'
      },
      {
        min: 222.15,
        max: 225.0,
        modos: ['FM', 'Digital'],
        nota: 'Repetidoras y simplex'
      }
    ]
  },
  {
    banda: '70 cm',
    min: 430.0,
    max: 440.0,
    unidad: 'MHz',
    decimales: 3,
    cd: false,
    ca: true,
    ce: true,
    xq: true,
    segmentos: [
      {
        min: 430.0,
        max: 432.0,
        modos: ['FM', 'Digital'],
        nota: 'Uso local / ATV según coordinación'
      },
      {
        min: 432.0,
        max: 433.0,
        modos: ['CW', 'USB', 'Digital'],
        nota: 'Señales débiles; llamada 432,100'
      },
      {
        min: 433.0,
        max: 435.0,
        modos: ['FM', 'Digital']
      },
      {
        min: 435.0,
        max: 438.0,
        modos: ['USB', 'Digital'],
        nota: 'Satélite (exclusivo)'
      },
      {
        min: 438.0,
        max: 440.0,
        modos: ['FM', 'Digital'],
        nota: 'Uso local / repetidoras'
      }
    ]
  },
  {
    banda: '23 cm',
    min: 1.24,
    max: 1.3,
    unidad: 'GHz',
    decimales: 3,
    cd: false,
    ca: true,
    ce: true,
    xq: true,
    segmentos: [
      {
        min: 1.24,
        max: 1.3,
        modos: ['CW', 'USB', 'AM', 'FM', 'Digital'],
        nota: 'ATV, FM, señales débiles y enlaces según plan local'
      }
    ]
  },
  {
    banda: '13 cm',
    min: 2.4,
    max: 2.45,
    unidad: 'GHz',
    decimales: 3,
    cd: false,
    ca: true,
    ce: true,
    xq: true,
    segmentos: [
      {
        min: 2.4,
        max: 2.45,
        modos: ['CW', 'USB', 'FM', 'Digital'],
        nota: 'Experimental, datos y satélite'
      }
    ]
  },
  {
    banda: '5,8 cm',
    min: 5.65,
    max: 5.65,
    unidad: 'GHz',
    decimales: 3,
    cd: false,
    ca: true,
    ce: true,
    xq: true,
    segmentos: [
      {
        min: 5.65,
        max: 5.65,
        modos: ['CW', 'USB', 'FM', 'Digital'],
        nota: 'Experimental'
      }
    ]
  }
]

const thClass =
  'border-b border-stone-300 bg-stone-50 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-700 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-100'

const tdClass =
  'border-b border-stone-200 px-3 py-3 text-stone-800 dark:border-indigo-900/60 dark:text-indigo-100'

const CeldaPermiso = ({ permitido }) => (
  <td className={`${tdClass} text-center`}>
    {permitido ? (
      <span
        className="font-mono text-green-700 dark:text-green-400"
        aria-label="Permitido"
      >
        ✓
      </span>
    ) : (
      <span
        className="text-stone-400 dark:text-indigo-500"
        aria-label="No permitido"
      >
        —
      </span>
    )}
  </td>
)

const EtiquetasModo = ({ modos }) => (
  <div className="flex flex-wrap gap-1">
    {modos.map(modo => (
      <span
        key={modo}
        className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wide text-stone-700 dark:bg-indigo-900/70 dark:text-indigo-100"
      >
        {modo}
      </span>
    ))}
  </div>
)

const SubtablaSegmentos = ({ segmentos, unidad, decimales }) => (
  <div className="overflow-x-auto rounded-lg border border-stone-200 bg-stone-50/80 dark:border-indigo-900 dark:bg-indigo-950/50">
    <table className="w-full text-xs">
      <thead>
        <tr>
          <th className={`${thClass} py-2`}>Segmento</th>
          {MODOS.map(modo => (
            <th key={modo} className={`${thClass} py-2 text-center`}>
              {modo}
            </th>
          ))}
          <th className={`${thClass} py-2`}>Nota</th>
        </tr>
      </thead>
      <tbody>
        {segmentos.map(seg => (
          <tr key={`${seg.min}-${seg.max}`}>
            <td className={`${tdClass} py-2 font-mono`}>
              {formatearRango(seg.min, seg.max, unidad, decimales)}
            </td>
            {MODOS.map(modo => (
              <CeldaPermiso
                key={modo}
                permitido={seg.modos.includes(modo)}
              />
            ))}
            <td className={`${tdClass} py-2 text-stone-500 dark:text-indigo-300/80`}>
              {seg.nota || '—'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const Espectro = () => {
  return (
    <section className="my-16 space-y-8">
      <header className="space-y-3 text-center">
        <h1 className="text-3xl font-serif font-semibold tracking-tight text-stone-900 sm:text-4xl dark:text-white">
          Espectro Radioeléctrico
        </h1>
        <p className="mx-auto max-w-3xl text-sm text-stone-700 sm:text-base dark:text-indigo-100">
          Bandas de frecuencia autorizadas para radioaficionados según el
          Reglamento del Servicio de Aficionados a las Radiocomunicaciones
          (Decreto Nº 523) y el Plan General de Uso del Espectro Radioeléctrico,
          regulados por la SUBTEL. Los segmentos de modo siguen el plan
          voluntario de IARU Región 2, recortado a las atribuciones chilenas.
        </p>
      </header>

      <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
        {CATEGORIAS.map(({ prefijo, nombre, descripcion }) => (
          <article
            key={prefijo}
            className="rounded-xl border border-stone-300/70 bg-white p-4 shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40"
          >
            <h2 className="font-mono text-lg font-semibold text-blue-950 dark:text-indigo-200">
              {prefijo}
              <span className="ml-2 font-sans text-sm font-medium text-stone-600 dark:text-indigo-300">
                — {nombre}
              </span>
            </h2>
            <p className="mt-2 text-sm text-stone-700 dark:text-indigo-100">
              {descripcion}
            </p>
          </article>
        ))}
      </div>

      <div className="mx-auto max-w-6xl overflow-hidden rounded-xl border border-stone-300/70 bg-white shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className={thClass}>Banda</th>
                <th className={thClass}>Rango</th>
                <th className={thClass}>Frecuencia media</th>
                <th className={thClass}>Modos</th>
                <th className={`${thClass} text-center`}>CD</th>
                <th className={`${thClass} text-center`}>CA</th>
                <th className={`${thClass} text-center`}>CE</th>
                <th className={`${thClass} text-center`}>XQ</th>
              </tr>
            </thead>
            <tbody>
              {BANDAS.map(banda => {
                const {
                  min,
                  max,
                  unidad,
                  decimales,
                  segmentos,
                  cd,
                  ca,
                  ce,
                  xq,
                  nota
                } = banda
                const dividida = segmentos.length > 1
                return (
                  <Fragment key={banda.banda}>
                    <tr className="transition-colors hover:bg-stone-50 dark:hover:bg-indigo-950/30">
                      <td className={`${tdClass} font-mono font-semibold`}>
                        {banda.banda}
                        {nota && (
                          <span className="mt-0.5 block text-xs font-normal text-red-700 dark:text-red-400">
                            {nota}
                          </span>
                        )}
                      </td>
                      <td className={`${tdClass} font-mono text-xs sm:text-sm`}>
                        {formatearRango(min, max, unidad, decimales)}
                      </td>
                      <td className={`${tdClass} font-mono text-xs sm:text-sm`}>
                        {formatearFreq((min + max) / 2, unidad, decimales)}
                      </td>
                      <td className={tdClass}>
                        <EtiquetasModo modos={modosUnicos(segmentos)} />
                      </td>
                      <CeldaPermiso permitido={cd} />
                      <CeldaPermiso permitido={ca} />
                      <CeldaPermiso permitido={ce} />
                      <CeldaPermiso permitido={xq} />
                    </tr>
                    {dividida && (
                      <tr>
                        <td
                          colSpan={8}
                          className="bg-stone-50/40 px-3 py-3 dark:bg-indigo-950/20"
                        >
                          <p className="mb-2 text-xs font-medium text-stone-500 dark:text-indigo-300/80">
                            Segmentos de {banda.banda}
                          </p>
                          <SubtablaSegmentos
                            segmentos={segmentos}
                            unidad={unidad}
                            decimales={decimales}
                          />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mx-auto max-w-3xl text-center text-xs text-stone-500 dark:text-indigo-300/80">
        La frecuencia media es el punto medio del rango: un buen punto de
        partida para cortar una antena monobanda que cubra toda la asignación.
        Debajo de 10 MHz la fonía se hace en LSB; por encima, en USB. El CW se
        admite en casi toda la banda, pero el plan reserva el borde bajo a
        telegrafía. Los segmentos son la guía voluntaria de IARU Región 2
        (2020), recortada a lo que atribuye SUBTEL en Chile; no sustituyen al
        reglamento. Fuente: Decreto Nº 523 (2007), Resolución Exenta Nº 175
        (2014), Plan General de Uso del Espectro y{' '}
        <a
          href="https://iaru-r2.org/wp-content/uploads/2020/02/IARU-R2-Plan-de-Bandas.pdf"
          className="underline underline-offset-2 hover:text-stone-700 dark:hover:text-indigo-100"
          target="_blank"
          rel="noopener noreferrer"
        >
          plan de bandas IARU R2
        </a>
        . Consulte la normativa vigente en{' '}
        <a
          href="https://www.subtel.gob.cl/inicio-concesionario/servicios-de-telecomunicaciones/servicios-de-radio-aficionados/"
          className="underline underline-offset-2 hover:text-stone-700 dark:hover:text-indigo-100"
          target="_blank"
          rel="noopener noreferrer"
        >
          SUBTEL
        </a>
        .
      </p>
    </section>
  )
}

export default Espectro
