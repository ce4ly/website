const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-stone-200 bg-white dark:border-indigo-900 dark:bg-indigo-950">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-4 text-xs text-blue-950 sm:flex-row sm:items-center sm:justify-between sm:text-sm dark:text-indigo-300">
        <span>© {year} Radio Club Lircay. Todos los derechos reservados.</span>
        <div className="flex flex-wrap items-center gap-3 text-blue-950 dark:text-indigo-100">
          <span>
            Desarrollado por{' '}
            <a
              href="https://www.qrz.com/db/CA4NFS"
              className="text-blue-700 transition-colors hover:text-blue-950 dark:text-indigo-300 dark:hover:text-indigo-100"
            >
              CA4NFS
            </a>
            .
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
