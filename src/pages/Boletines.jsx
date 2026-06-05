import SoundCloudSection from '../components/SoundCloudSection.jsx'

const Boletines = () => {
  return (
    <section className="my-16 space-y-8">
      <header className="space-y-3">
        <h1 className="text-center text-3xl font-serif font-semibold tracking-tight text-stone-900 sm:text-4xl dark:text-white">
          Boletines Informativos
        </h1>
        <p className="mx-auto max-w-3xl text-justify text-sm text-stone-700 sm:text-base dark:text-indigo-100">
          El Radio Club Lircay, a través de su estación repetidora en VHF,
          transmite boletines informativos los días sábado entre 20:30 y 21:00,
          los cuales son grabados y publicados en nuestro SoundCloud. Además, se
          desarrollan operativos los días miércoles entre 20:30 y 21:00 con el
          propósito de entregar reportes de audio a las estaciones que se hacen
          presentes y pasar mensajes informativos.
        </p>
      </header>

      <SoundCloudSection />
    </section>
  )
}

export default Boletines
