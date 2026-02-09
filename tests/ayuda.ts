import assert from 'node:assert/strict'

/** Igual a `esperado` con `decimales` cifras (equivale a `toBeCloseTo` de Jest/Vitest). */
export function cerca(actual: number | null | undefined, esperado: number, decimales = 2) {
  assert.ok(typeof actual === 'number', `se esperaba un número y llegó ${actual}`)
  const tolerancia = 10 ** -decimales / 2
  assert.ok(
    Math.abs(actual - esperado) < tolerancia,
    `${actual} no está a menos de ${tolerancia} de ${esperado}`,
  )
}

/** Afirma que el valor no es `null`/`undefined` y lo devuelve ya estrechado. */
export function definido<T>(valor: T | null | undefined): T {
  assert.ok(valor !== null && valor !== undefined, 'valor nulo')
  return valor
}
