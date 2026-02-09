/**
 * Genera public/data/socios.json a partir de socios.txt (un indicativo por línea).
 *
 *   npm run socios                 # usa socios.txt de la raíz del repo
 *   npm run socios -- otra/ruta.txt
 *
 * Corre antes de `dev` y de `build`: para actualizar la lista de socios basta editar socios.txt.
 * Falla si alguna línea no es un indicativo; avisa (sin fallar) de duplicados y de socios que no
 * figuran en el listado de SUBTEL (public/data/licencias.json).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { candidatosPorSufijo, type Listado, type ListadoSocios } from '../src/lib/licencias.ts'
import { leerSocios } from '../src/lib/socios.ts'

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const entrada = path.resolve(raiz, process.argv[2] ?? 'socios.txt')
const salida = path.join(raiz, 'public/data/socios.json')
const listado = path.join(raiz, 'public/data/licencias.json')

const { indicativos, invalidos, duplicados } = leerSocios(fs.readFileSync(entrada, 'utf-8'))

if (invalidos.length) {
  for (const { linea, texto } of invalidos) {
    console.error(`${path.relative(raiz, entrada)}:${linea}: «${texto}» no es un indicativo`)
  }
  process.exit(1)
}
if (duplicados.length) {
  console.warn(`Repetidos (se cuentan una vez): ${duplicados.join(', ')}`)
}

const { licencias } = JSON.parse(fs.readFileSync(listado, 'utf-8')) as Listado
const enSubtel = new Set(licencias.map((l) => l.indicativo))
for (const ausente of indicativos.filter((ind) => !enSubtel.has(ind))) {
  const candidatos = candidatosPorSufijo(licencias, ausente)
    .map((l) => `${l.indicativo} (${l.nombre}, ${l.comuna})`)
    .join(' o ')
  console.warn(
    `${ausente} no figura en el listado de SUBTEL${candidatos ? `; ¿será ${candidatos}?` : '.'}`,
  )
}

const datos: ListadoSocios = { indicativos }
fs.writeFileSync(salida, `${JSON.stringify(datos)}\n`)
console.log(`Socios: ${indicativos.length} → ${path.relative(raiz, salida)}`)
