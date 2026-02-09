/**
 * Lectura mínima de netlify.toml: solo lo que usa este repo (`[[redirects]]` y `[[headers]]` con
 * pares `clave = valor` simples). La usa tests/netlify.test.ts.
 */

export type Redirect = { from: string; to: string; status: number; force?: boolean }

export type Cabeceras = { patron: string; valores: Record<string, string> }

/** Bloques `[[redirects]]` en orden. */
export function leerRedirects(toml: string): Redirect[] {
  return toml
    .split('[[redirects]]')
    .slice(1)
    .map((bloque) => bloque.split(/^\[/m)[0])
    .map((bloque) => {
      const redirect: Record<string, unknown> = {}
      for (const linea of bloque.split('\n')) {
        const match = linea.trim().match(/^(from|to|status|force)\s*=\s*(.+)$/)
        if (match) redirect[match[1]] = JSON.parse(match[2])
      }
      return redirect as Redirect
    })
}

/** Bloques `[[headers]]` en orden: patrón (`for`) y cabeceras. */
export function leerCabeceras(toml: string): Cabeceras[] {
  return toml
    .split('[[headers]]')
    .slice(1)
    .map((bloque) => bloque.split(/^\[\[/m)[0])
    .flatMap((bloque) => {
      const patron = bloque.match(/for\s*=\s*"([^"]+)"/)?.[1]
      if (!patron) return []
      const valores: Record<string, string> = {}
      for (const [, nombre, valor] of bloque.matchAll(/^\s*([\w-]+)\s*=\s*"([^"]*)"\s*$/gm)) {
        if (nombre !== 'for') valores[nombre] = valor
      }
      return [{ patron, valores }]
    })
}
