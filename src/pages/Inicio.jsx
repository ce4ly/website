import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons"
import { faRadio, faSatelliteDish } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function Inicio() {
  return (
    <section className="space-y-4 items-center">
      <img src="/hero.jpg" className="rounded-b-lg border border-1 border-t-0 border-stone-400/60 shadow shadow-lg shadow-stone-600" />
      <div class="flex flex-col flex-nowrap items-center gap-8 my-12">
        <img src="/logo-frontpage.png" className="size-64 rounded-full shadow shadow-lg shadow-stone-600" />
        <div class="flex flex-row flex-nowrap items-center justify-center place-content-between gap-16">
          <ul class="flex flex-row flex-nowrap gap-4">
            <li>
              <a href="https://www.facebook.com/Ce4rly" target="_blank" title="Facebook">
                <FontAwesomeIcon icon={faFacebook} size="3x" />
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/ce4ly" target="_blank" title="Instagram">
                <FontAwesomeIcon icon={faInstagram} size="3x" />
              </a>
            </li>
            <li>
              <a href="https://www.qrz.com/db/ce4ly" target="_blank" title="QRZ">
                <FontAwesomeIcon icon={faSatelliteDish} size="3x" />
              </a>
            </li>
          </ul>
          <div className="bg-blue-950 p-4 w-full text-white shadow shadow-lg shadow-stone-600">
            <h2 className="font-black font-serif mb-4">
              Nuestros Repetidores:
            </h2>
            <p className="font-mono">
              146,380 MHz - t67.0 - +0.600
            </p>
            <p className="font-mono">
              433,100 MHz - t67.0 - +5.000
            </p>
          </div>
        </div>
        <p className="font-serif">Sitio Web en constante actualización.</p>
      </div>
    </section>
  )
}

export default Inicio

