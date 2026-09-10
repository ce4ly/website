/**
 * Dimensiones de una discone a partir de la frecuencia mínima.
 *
 * Referencias (no se inventan coeficientes):
 * - ARRL Antenna Book (Hall, ed.): el cono vale λ/4 a fmin; el disco, 0,7 × (λ/4).
 * - Belrose, VE2CV, QST julio 1975: ángulo de cono típico 60° (30° al eje);
 *   el disco vale 0,64–0,70 del diámetro de la boca del cono.
 * - RSGB / práctica amateur: 8–16 varillas; ancho de banda útil ~ f a 10·f.
 *
 * Se reportan valor nominal y rango aceptable, no un único número mágico.
 */
const LAMBDA = fMhz => 300 / fMhz

export const discone = fMinMhz => {
  if (!(fMinMhz > 0)) return null
  const lambda = LAMBDA(fMinMhz)
  const cuarto = lambda / 4
  const semiAnguloDeg = 30
  const semiAnguloRad = (semiAnguloDeg * Math.PI) / 180
  const largoInclNominal = cuarto
  const diamBocaNominal = 2 * largoInclNominal * Math.sin(semiAnguloRad)
  const diamDiscoNominal = 0.7 * diamBocaNominal
  const diamConoSupNominal = 0.017 * lambda
  const separacionNominal = 0.3 * diamConoSupNominal

  return {
    lambda,
    fMaxUtilMhz: fMinMhz * 10,
    largoInclinado: {
      nominal: largoInclNominal,
      min: 0.22 * lambda,
      max: 0.25 * lambda,
      unidad: 'm',
      nota: 'Lado del cono ≈ λ/4 a fmin (ARRL Antenna Book).'
    },
    diametroDisco: {
      nominal: diamDiscoNominal,
      min: 0.64 * diamBocaNominal,
      max: 0.7 * diamBocaNominal,
      unidad: 'm',
      nota: '0,64–0,70 del diámetro de la boca del cono (Belrose / ARRL).'
    },
    diametroBocaCono: {
      nominal: diamBocaNominal,
      min: 2 * 0.22 * lambda * Math.sin(semiAnguloRad),
      max: 2 * 0.25 * lambda * Math.sin(semiAnguloRad),
      unidad: 'm',
      nota: 'Boca del cono con ángulo incluido de 60°.'
    },
    diametroSuperiorCono: {
      nominal: diamConoSupNominal,
      min: 0.01 * lambda,
      max: 0.03 * lambda,
      unidad: 'm',
      nota: 'Truncado para el conector; no es un vértice ideal.'
    },
    separacionDiscoCono: {
      nominal: separacionNominal,
      min: 0.002 * lambda,
      max: 0.005 * lambda,
      unidad: 'm',
      nota: 'El aislante define el extremo alto de la banda.'
    },
    anguloCono: {
      nominal: 60,
      min: 50,
      max: 80,
      unidad: '°',
      nota: 'Ángulo incluido. 25°–40° respecto del eje (típico 30°).'
    },
    varillas: {
      nominal: 8,
      min: 8,
      max: 16,
      unidad: '',
      nota: 'Más varillas acercan el cono a una superficie continua.'
    }
  }
}
