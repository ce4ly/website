import type { ReactNode } from 'react'

import Encabezado from './Encabezado'

/** Página de texto legal: título, fecha de actualización y secciones numeradas. */
export const DocumentoLegal = ({
  titulo,
  actualizado,
  children,
}: {
  titulo: string
  /** «29 de octubre de 2026» */
  actualizado: string
  children: ReactNode
}) => (
  <section className='mb-16 space-y-10'>
    <Encabezado titulo={titulo}>Última actualización: {actualizado}.</Encabezado>
    <article className='mx-auto max-w-3xl space-y-8 text-sm leading-relaxed text-stone-700 sm:text-base dark:text-indigo-100'>
      {children}
    </article>
  </section>
)

export const SeccionLegal = ({ titulo, children }: { titulo: string; children: ReactNode }) => (
  <section className='space-y-3'>
    <h2 className='font-serif text-xl font-semibold text-stone-900 dark:text-white'>{titulo}</h2>
    {children}
  </section>
)

/** Lista con viñetas para enumerar datos, usos o servicios. */
export const ListaLegal = ({ children }: { children: ReactNode }) => (
  <ul className='list-disc space-y-1.5 pl-5'>{children}</ul>
)
