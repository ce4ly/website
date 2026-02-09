import Contenido from './components/partials/Contenido'
import DocumentHead from './components/partials/DocumentHead'
import Footer from './components/partials/Footer'
import Header from './components/partials/Header'

const App = () => (
  <div className='flex min-h-screen flex-col'>
    <DocumentHead />
    <Header />
    {/* El contenido va en una franja lisa: la estática del fondo queda solo a los costados. */}
    <main className='flex flex-1 flex-col'>
      <div className='mx-auto flow-root w-full max-w-5xl flex-1 bg-stone-100 px-4 shadow-xl ring-1 ring-black/5 sm:px-6 dark:bg-slate-900 dark:ring-white/5'>
        <Contenido />
      </div>
    </main>
    <Footer />
  </div>
)

export default App
