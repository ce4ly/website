/**
 * Bloque destacado de la portada. El contenido vive aquí —no en el JSX—
 * para poder reponer otro foco (por ejemplo, infraestructura) sin tocar
 * el componente de la página.
 */
export const BLOQUE_PORTADA = {
  id: 'antenas-experimentacion',
  titulo: 'Antenas y experimentación',
  texto:
    'El foco actual del club es la construcción de antenas y la experimentación técnica. En el sitio hay calculadoras y referencias para el taller, y dictamos cursos abiertos a la comunidad.',
  enlaces: [
    { href: '/herramientas', label: 'Herramientas y calculadoras' },
    { href: '/cursos', label: 'Cursos' }
  ]
}
