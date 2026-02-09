import type { SVGProps } from 'react'
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons'

type IconProps = Omit<SVGProps<SVGSVGElement>, 'children'> & {
  icon: IconDefinition
}

/**
 * Icono de Font Awesome como SVG en línea, sin @fortawesome/fontawesome-svg-core (≈55 kB menos).
 * Mismo markup y clases que `FontAwesomeIcon`; la CSS base (`.svg-inline--fa`) está en app.css, así
 * que el HTML pre-renderizado ya sale con el tamaño correcto, sin esperar al JS.
 */
const Icon = ({ icon, className, ...props }: IconProps) => {
  const [width, height, , , pathData] = icon.icon
  const paths = Array.isArray(pathData) ? pathData : [pathData]

  return (
    <svg
      data-prefix={icon.prefix}
      data-icon={icon.iconName}
      className={`svg-inline--fa fa-${icon.iconName}${className ? ` ${className}` : ''}`}
      role='img'
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden='true'
      {...props}
    >
      {paths.map((d) => (
        <path key={d} fill='currentColor' d={d} />
      ))}
    </svg>
  )
}

export default Icon
