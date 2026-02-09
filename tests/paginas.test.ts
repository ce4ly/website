import assert from 'node:assert/strict'
import fs from 'node:fs'
import { describe, it } from 'node:test'

import { DIRECTORIO } from '../src/lib/directorio.ts'
import { NAV_PRINCIPAL } from '../src/lib/nav.ts'
import {
  HERRAMIENTA_GRUPOS_MENU,
  HERRAMIENTA_GRUPOS_PAGINA,
  PAGINAS,
  RUTA_PROPAGACION,
  RUTAS_OFFLINE,
  TOOLS,
  enlaceContacto,
  esRutaDeHerramienta,
  paginaPorRuta,
  rutaDe,
} from '../src/lib/paginas.ts'

describe('catálogo de páginas', () => {
  it('cada página tiene slug, ruta con barra final, título y descripción', () => {
    for (const p of PAGINAS) {
      assert.ok(p.slug, JSON.stringify(p))
      assert.match(p.path, /^\/(.*\/)?$/, p.path)
      assert.ok(p.title, p.slug)
      assert.ok(p.description.length > 20, p.slug)
      assert.ok(p.keywords.length > 0, p.slug)
    }
  })

  it('slugs, rutas y títulos no se repiten', () => {
    for (const campo of ['slug', 'path', 'title'] as const) {
      const valores = PAGINAS.map((p) => p[campo])
      assert.equal(new Set(valores).size, valores.length, campo)
    }
  })

  it('paginaPorRuta acepta la ruta con y sin barra final', () => {
    assert.equal(paginaPorRuta('/calculadoras/dipolo')?.slug, 'dipolo')
    assert.equal(paginaPorRuta('/calculadoras/dipolo/')?.slug, 'dipolo')
    assert.equal(paginaPorRuta('/')?.slug, 'inicio')
    assert.equal(paginaPorRuta('/no-existe/'), undefined)
  })

  it('enlace al formulario con asunto', () => {
    assert.equal(
      enlaceContacto('Consulta curso Electrónica'),
      '/contacto/?asunto=Consulta+curso+Electr%C3%B3nica',
    )
    assert.equal(new URL(enlaceContacto('A & B'), 'https://x').searchParams.get('asunto'), 'A & B')
  })
})

describe('herramientas', () => {
  it('todas aparecen en /herramientas/, en su sección', () => {
    const enPagina = HERRAMIENTA_GRUPOS_PAGINA.flatMap((g) => g.links.map((l) => l.to))
    assert.deepEqual(new Set(enPagina), new Set(TOOLS.map((t) => t.path)))
    const potencia = HERRAMIENTA_GRUPOS_PAGINA.find((g) =>
      g.links.some((l) => l.to === rutaDe('potencia')),
    )
    assert.equal(potencia?.title, 'Calculadoras Auxiliares')
  })

  it('el menú usa menuSection y omite las ocultas', () => {
    const convertidores = HERRAMIENTA_GRUPOS_MENU.find((g) => g.title === 'Convertidores')
    assert.ok(convertidores?.links.some((l) => l.to === rutaDe('potencia')))
    const enMenu = HERRAMIENTA_GRUPOS_MENU.flatMap((g) => g.links.map((l) => l.to))
    assert.ok(!enMenu.includes(rutaDe('moxon')))
  })

  it('marca el menú Herramientas en sus páginas', () => {
    assert.ok(esRutaDeHerramienta('/herramientas'))
    assert.ok(esRutaDeHerramienta('/calculadoras/yagi/'))
    assert.ok(!esRutaDeHerramienta('/cursos/'))
  })
})

describe('menú y uso sin conexión', () => {
  it('el menú va Inicio, Acerca, Directorio, Boletines, Cursos, Herramientas, Emergencias, Contacto', () => {
    assert.deepEqual(
      NAV_PRINCIPAL.map((i) => i.label),
      [
        'Inicio',
        'Acerca',
        'Directorio',
        'Boletines',
        'Cursos',
        'Herramientas',
        'Emergencias',
        'Contacto',
      ],
    )
  })

  it('el precache cubre las herramientas, cursos y emergencias, no contacto ni el reloj', () => {
    for (const ruta of ['/herramientas/', '/calculadoras/dipolo/', '/cursos/', '/emergencias/']) {
      assert.ok(RUTAS_OFFLINE.includes(ruta), ruta)
    }
    assert.ok(!RUTAS_OFFLINE.includes(rutaDe('contacto')))
    assert.ok(!RUTAS_OFFLINE.includes(RUTA_PROPAGACION))
  })
})

describe('directorio', () => {
  it('cada integrante actual tiene foto WebP en public/', () => {
    for (const { indicativo, foto } of DIRECTORIO) {
      const archivo = fs.readFileSync(new URL(`../public${foto}`, import.meta.url))
      assert.equal(archivo.toString('ascii', 8, 12), 'WEBP', indicativo)
    }
  })
})
