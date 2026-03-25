const DIRECTORIO = [
  {
    nombre: 'Patricio Soto Leiva',
    indicativo: 'CE4GM',
    puesto: 'Presidente',
    foto: '/ce4gm.jpg',
    qrz: 'https://www.qrz.com/db/CE4GM'
  },
  {
    nombre: 'Luís Roco Vásquez',
    indicativo: 'CA4LKN',
    puesto: 'Secretario',
    foto: '/ca4lkn.jpg',
    qrz: 'https://www.qrz.com/db/CA4LKN'
  },
  {
    nombre: 'Jorge Chávez Pallero',
    indicativo: 'CE4CNR',
    puesto: 'Tesorero',
    foto: '/ce4cnr.jpg',
    qrz: 'https://www.qrz.com/db/CE4CNR'
  },
  {
    nombre: 'Rodrigo Araya Valenzuela',
    indicativo: 'CE4RIA',
    puesto: 'Director',
    foto: '/ce4ria.jpg',
    qrz: 'https://www.qrz.com/db/CE4RIA'
  },
  {
    nombre: 'Yeico Ramirez Ramirez',
    indicativo: 'CA4FKD',
    puesto: 'Director',
    foto: '/ca4fkd.jpg',
    qrz: 'https://www.qrz.com/db/CA4FKD'
  },
  {
    nombre: 'Carlos Hernández Peña y Lillo',
    indicativo: 'CE4CHP',
    puesto: 'Director',
    foto: '/ce4chp.jpg',
    qrz: 'https://www.qrz.com/db/CE4CHP'
  }
]

const Directorio = () => {
  return (
    <section className="my-16 space-y-8">
      <header className="space-y-3 text-center">
        <h1 className="text-3xl font-serif font-semibold tracking-tight text-stone-900 sm:text-4xl dark:text-white">
          Directorio
        </h1>
        <p className="mx-auto max-w-3xl text-sm text-stone-700 sm:text-base dark:text-indigo-100">
          Conoce al directorio del Radio Club Lircay.
        </p>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {DIRECTORIO.map(persona => {
          return (
            <article
              key={persona.indicativo}
              className="overflow-hidden rounded-xl border border-stone-300/70 bg-white shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40"
            >
              <img
                src={persona.foto}
                alt={`Fotografía de ${persona.nombre}`}
                className="aspect-square w-full object-cover"
              />
              <div className="space-y-1 p-4">
                <h2 className="text-lg font-semibold text-stone-900 dark:text-white">
                  {persona.nombre}
                </h2>
                <a
                  href={persona.qrz}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block font-mono text-sm text-blue-950 underline underline-offset-4 transition-colors hover:text-blue-700 dark:text-indigo-200 dark:hover:text-indigo-100"
                >
                  {persona.indicativo}
                </a>
                <p className="text-sm text-stone-700 dark:text-indigo-100">
                  {persona.puesto}
                </p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default Directorio
