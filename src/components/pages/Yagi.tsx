import { useState } from 'react'

import {
  disenarYagiDl6wu,
  esPositivo,
  formatearLongitud,
  formatearNumero,
  frecuenciaValida,
  longitudOnda,
  parseNumero,
} from '../../lib/calculadoras'
import CalculadoraLayout, {
  Articulo,
  Campo,
  Cota,
  Fila,
  Formula,
  Nota,
  Resultado,
} from '../calculadora/CalculadoraLayout'
import { CampoNumero, Selector } from '../calculadora/Campos'
import Diagrama, { Alambre, Alimentacion, CotaSvg, Etiqueta } from '../calculadora/Diagrama'

const YagiDiagrama = () => (
  <Diagrama
    titulo='Diagrama esquemático de yagi de 3 elementos'
    viewBox='0 0 340 224'
    pie='Vista de lado (no a escala). Las letras coinciden con las medidas.'
  >
    {/* Boom */}
    <Alambre x1={48} y1={108} x2={292} y2={108} grosor={3} />

    {/* Reflector R, excitado E y director Dir */}
    <Alambre x1={60} y1={36} x2={60} y2={180} />
    <Etiqueta x={60} y={28}>
      R
    </Etiqueta>
    <Alambre x1={160} y1={48} x2={160} y2={168} />
    <Alimentacion cx={160} cy={108} />
    <Etiqueta x={160} y={40}>
      E
    </Etiqueta>
    <Alambre x1={280} y1={58} x2={280} y2={158} />
    <Etiqueta x={280} y={50}>
      Dir
    </Etiqueta>

    <CotaSvg x1={60} y1={16} x2={280} y2={16} letra='B' lx={170} ly={12} />
    <CotaSvg x1={60} y1={196} x2={160} y2={196} letra='s1' lx={110} ly={210} />
    <CotaSvg x1={160} y1={196} x2={280} y2={196} letra='s2' lx={220} ly={210} />
  </Diagrama>
)

type Modo = 'hf' | 'vhf'

const OPCIONES_MODO = [
  { value: 'hf', label: 'HF — 2 o 3 elementos' },
  { value: 'vhf', label: 'VHF/UHF — DL6WU' },
] as const

/** Valores de partida de cada receta. */
const INICIAL: Record<Modo, { elementos: string; diametro: string }> = {
  hf: { elementos: '3', diametro: '12' },
  vhf: { elementos: '10', diametro: '8' },
}

/** Receta HF clásica de 2 o 3 elementos. */
const YagiHf = ({ lambda, n }: { lambda: number; n: 2 | 3 }) => (
  <Resultado>
    <Fila etiqueta={<Cota letra='λ'>Longitud de onda</Cota>} valor={formatearLongitud(lambda)} />
    <Fila etiqueta={<Cota letra='R'>Reflector</Cota>} valor={formatearLongitud(0.5 * lambda)} />
    <Fila etiqueta={<Cota letra='E'>Excitado</Cota>} valor={formatearLongitud(0.475 * lambda)} />
    {n === 3 && (
      <Fila etiqueta={<Cota letra='Dir'>Director</Cota>} valor={formatearLongitud(0.45 * lambda)} />
    )}
    <Fila
      etiqueta={<Cota letra='s1'>Espacio reflector–excitado</Cota>}
      valor={formatearLongitud(0.2 * lambda)}
    />
    {n === 3 && (
      <Fila
        etiqueta={<Cota letra='s2'>Espacio excitado–director</Cota>}
        valor={formatearLongitud(0.15 * lambda)}
      />
    )}
    <Fila
      etiqueta={<Cota letra='B'>Boom</Cota>}
      valor={formatearLongitud((n === 2 ? 0.2 : 0.35) * lambda)}
      resaltar
    />
  </Resultado>
)

const Yagi = () => {
  const [frecuencia, setFrecuencia] = useState('')
  const [modo, setModo] = useState<Modo>('hf')
  const [elementos, setElementos] = useState(INICIAL.hf.elementos)
  const [diametro, setDiametro] = useState(INICIAL.hf.diametro)
  const mhz = parseNumero(frecuencia)
  const n = Math.round(parseNumero(elementos) ?? 0)
  const d = parseNumero(diametro)
  const valida = frecuenciaValida(mhz)
  const nHf = modo === 'hf' && (n === 2 || n === 3) ? n : null
  const dl6 =
    modo === 'vhf' && valida && n >= 8 && n <= 40 && esPositivo(d)
      ? disenarYagiDl6wu({ mhz, elementos: n, diametroMm: d })
      : null

  const cambiarModo = (siguiente: Modo) => {
    setModo(siguiente)
    setElementos(INICIAL[siguiente].elementos)
    setDiametro(INICIAL[siguiente].diametro)
  }

  return (
    <CalculadoraLayout
      titulo='Calculadora Yagi'
      intro='HF de 2 o 3 elementos con espaciado clásico, o VHF/UHF larga según DL6WU (elementos y espacios escalables).'
    >
      <Articulo titulo='Dos recetas'>
        <p className='text-justify'>
          En HF una yagi de 2–3 elementos cabe en un techo y ya da ganancia y relación
          frente/espalda. En VHF/UHF las yagis largas de Günter Hoch (DL6WU) usan espacios que
          crecen hasta 0,40 λ y largos que se acortan a lo largo del boom: buena ganancia y ancho de
          banda.
        </p>
        <YagiDiagrama />
        <Formula>
          <p>HF: R ≈ 0,50 λ &nbsp; E ≈ 0,475 λ &nbsp; Dir ≈ 0,45 λ</p>
          <p>s1 = 0,20 λ &nbsp; s2 = 0,15 λ &nbsp; B = s1 + s2</p>
          <p>DL6WU: s1 = 0,20 λ; primer Dir a 0,075 λ</p>
        </Formula>
        <Nota>
          DL6WU brilla a partir de ~10 elementos (boom ≥ 2 λ). Sin corrección de boom metálico: si
          los elementos atraviesan y se unen al boom, alárguelos según el diámetro del tubo. El DE
          está 2 % más largo para dipolo plegado.
        </Nota>
      </Articulo>
      <Campo>
        <Selector
          id='ya-m'
          etiqueta='Tipo'
          value={modo}
          onChange={cambiarModo}
          opciones={OPCIONES_MODO}
        />
        <CampoNumero
          id='ya-f'
          etiqueta='Frecuencia (MHz)'
          placeholder={modo === 'hf' ? 'Ej: 7,148' : 'Ej: 146,380'}
          value={frecuencia}
          onChange={setFrecuencia}
        />
        <CampoNumero
          id='ya-n'
          etiqueta={<Cota letra='N'>Número de elementos</Cota>}
          inputMode='numeric'
          value={elementos}
          onChange={setElementos}
        />
        {modo === 'vhf' && (
          <CampoNumero
            id='ya-d'
            etiqueta={<Cota letra='d'>Diámetro de parásitos (mm)</Cota>}
            value={diametro}
            onChange={setDiametro}
          />
        )}
      </Campo>
      {valida && nHf !== null && <YagiHf lambda={longitudOnda(mhz)} n={nHf} />}
      {valida && nHf === null && !dl6 && (
        <Nota>
          {modo === 'hf'
            ? 'La receta HF simple cubre 2 o 3 elementos. Para más elementos, cambie a VHF/UHF (DL6WU).'
            : 'DL6WU se calcula de 8 a 40 elementos y necesita el diámetro de los parásitos.'}
        </Nota>
      )}
      {dl6 && (
        <Resultado>
          <Fila etiqueta='Ganancia estimada' valor={`${formatearNumero(dl6.ganancia, 1)} dBd`} />
          <Fila
            etiqueta={<Cota letra='B'>Boom eléctrico</Cota>}
            valor={formatearLongitud(dl6.boom)}
          />
          <Fila
            etiqueta={<Cota letra='R'>Reflector (pos. 0)</Cota>}
            valor={formatearLongitud(dl6.reflector)}
          />
          <Fila
            etiqueta={
              <Cota letra='E'>{`Excitado (pos. ${formatearLongitud(dl6.reflectorEspacio)})`}</Cota>
            }
            valor={formatearLongitud(dl6.driven)}
          />
          {dl6.dirs.map((el) => (
            <Fila
              key={el.nombre}
              etiqueta={
                <Cota letra='Dir'>{`${el.nombre} (pos. ${formatearLongitud(el.posicion)})`}</Cota>
              }
              valor={formatearLongitud(el.largo)}
            />
          ))}
        </Resultado>
      )}
    </CalculadoraLayout>
  )
}

export default Yagi
