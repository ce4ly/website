export const CURSOS_INTRO = {
  titulo: 'Cursos del Radio Club Lircay',
  texto:
    'Los cursos son abiertos a la comunidad, no solo a quienes ya participan del club. Los dictamos como parte de nuestra vinculación comunitaria: quien quiera aprender electrónica, armar una antena o prepararse para el examen de SUBTEL puede sumarse. La fecha de la próxima versión de cada curso está por definir.'
}

export const CURSOS = [
  {
    slug: 'electronica-basica',
    nombre: 'Electrónica Básica',
    fecha: 'Por definir',
    imagen: '/img/cursos/electronica-basica.webp',
    width: 800,
    height: 534,
    alt: 'Primer plano de un cautín soldando un cable sobre una placa de circuito impreso',
    credito: {
      autor: 'Tima Miroshnichenko',
      url: 'https://www.pexels.com/photo/a-wire-being-soldered-on-the-motherboard-6755136/'
    },
    descripcion:
      'Fundamentos para entender y reparar equipos de radio: ley de Ohm, componentes, mediciones y uso del multímetro. Pensado para quien parte desde cero. No se asume experiencia previa en el taller: se trabaja con lo básico para leer un circuito y hacer mediciones con seguridad. La fecha de la próxima versión está por definir.'
  },
  {
    slug: 'confeccion-antenas',
    nombre: 'Confección de Antenas',
    fecha: 'Por definir',
    imagen: '/img/cursos/confeccion-antenas.webp',
    width: 800,
    height: 534,
    alt: 'Torre de antena contra el cielo, usada como referencia visual del curso de confección',
    credito: {
      autor: 'Pixabay',
      url: 'https://www.pexels.com/photo/gray-antenna-tower-under-white-sky-356807/'
    },
    descripcion:
      'Construcción práctica de antenas con materiales accesibles: cálculo, corte, armado y ajuste con medidor de ROE. Se apoya en las calculadoras del sitio. Sirve tanto para quien arma su primera antena como para quien quiere entender por qué una medida funciona en el campo. La fecha de la próxima versión está por definir.'
  },
  {
    slug: 'reglamentacion',
    nombre: 'Reglamentación',
    fecha: 'Por definir',
    imagen: '/img/cursos/reglamentacion.webp',
    width: 800,
    height: 534,
    alt: 'Mesa de estudio con una radio antigua, un libro y anteojos',
    credito: {
      autor: 'Feyza Daştan',
      url: 'https://www.pexels.com/photo/a-cup-of-coffee-eyeglasses-on-a-book-and-an-old-radio-25490244/'
    },
    descripcion:
      'Normativa del servicio de aficionados en Chile, categorías de licencia y preparación para el examen de SUBTEL. Orientado a quien se prepara para rendir o quiere tener clara la normativa que rige la actividad. La fecha de la próxima versión está por definir.'
  }
]

export const asuntoConsultaCurso = nombre => `Consulta curso ${nombre}`
