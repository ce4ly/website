import type { NombreIcono } from '../components/partials/Icono'
import { rutaDe, type PaginaId } from './paginas'

type EnlaceNav = { id: PaginaId; to: string; label: string; icono: NombreIcono }

const enlace = (id: PaginaId, label: string, icono: NombreIcono): EnlaceNav => ({
  id,
  to: rutaDe(id),
  label,
  icono,
})

/** Orden del menú principal (header y menú móvil). */
export const NAV_PRINCIPAL: readonly EnlaceNav[] = [
  enlace('inicio', 'Inicio', 'inicio'),
  enlace('acerca', 'Acerca', 'acerca'),
  enlace('directorio', 'Directorio', 'usuarios'),
  enlace('boletines', 'Boletines', 'boletines'),
  enlace('cursos', 'Cursos', 'cursos'),
  enlace('herramientas', 'Herramientas', 'herramientas'),
  enlace('emergencias', 'Emergencias', 'emergencias'),
  enlace('contacto', 'Contacto', 'contacto'),
]
