[![Netlify Status](https://api.netlify.com/api/v1/badges/65942ece-dafe-412e-add6-9f7f2045ecaf/deploy-status)](https://app.netlify.com/projects/ce4ly/deploys)

# Radio Club Lircay (CE4LY)

Sitio de [www.ce4ly.cl](https://www.ce4ly.cl/): portada, cursos, boletines, emergencias y unas 45
herramientas de taller (calculadoras de antenas, referencias, tablas de frecuencias). Funciona sin
conexión una vez visitado, para usarlo en el cerro durante una activación.

- **Producción:** [https://www.ce4ly.cl/](https://www.ce4ly.cl/)
- **Deploy:** Netlify (sitio estático + Netlify Forms + proxies)
- **Idioma:** español de Chile

## Stack

| Capa    | Tecnología                                                      |
| ------- | --------------------------------------------------------------- |
| UI      | React 19 + TypeScript (estricto)                                |
| Build   | Vite 8                                                          |
| Estilos | Tailwind CSS 4 (tema claro/oscuro con la clase `dark`)          |
| Rutas   | react-router-dom 7 (una ruta por página, con barra final)       |
| Iconos  | heroicons (interfaz) y Font Awesome (redes) vía `<Icon>` propio |
| SSG     | Prerender de cada página (`react-dom/static`) + service worker  |
| Pruebas | `node:test` + tsx (`tests/`)                                    |
| Calidad | ESLint (typescript-eslint, react-hooks) + Prettier              |

## Desarrollo

Requisitos: Node.js (versión en `.nvmrc`) y npm.

```bash
npm install
npm run dev           # http://localhost:5173 (los proxies de Netlify se replican en Vite)
npm test              # pruebas en tests/
npm run lint          # ESLint
npm run format        # Prettier (format:check solo revisa)
npm run build         # tsc + cliente + SSR (dist-ssr/, no se publica) + prerender
npm run preview       # sirve dist/
```

El build termina con «Pre-renderizadas N rutas (M páginas + 404); sw.js con K URLs en precache».

## Publicación en Netlify

`netlify.toml` define todo lo necesario: el comando de build (lint, formato y pruebas antes de
construir: si algo falla, no se publica), la carpeta `dist`, los redirects y las cabeceras.

Al conectar el repositorio por primera vez:

1. **Forms → notificaciones:** agregar un aviso por correo a `contacto@ce4ly.cl` para el
   formulario `contacto`. Netlify lo detecta solo en `dist/contacto/index.html`.
2. **Dominio:** apuntar `www.ce4ly.cl` (y el dominio raíz, que redirige a `www`) a Netlify.
3. No hace falta configurar variables de entorno: el sitio no guarda secretos.

## Qué resuelve Netlify (antes, PHP en el VPS)

| Antes (Apache + PHP)                         | Ahora (Netlify)                                              |
| -------------------------------------------- | ------------------------------------------------------------ |
| `api/contact.php` + Mailgun + captcha propio | Netlify Forms (honeypot + filtro de spam de Netlify)         |
| `feedBoletines.php` (caché del RSS)          | Proxy `/boletines.xml` → feed de SoundCloud                  |
| `api/solar.php` (índices de hamqsl.com)      | Proxy `/api/solar.xml`; el XML se interpreta en el navegador |
| `.htaccess` (redirects, 404)                 | `[[redirects]]` en `netlify.toml`, `404.html`                |

Las URLs antiguas del feed (`/feedBoletines.php`, …) redirigen con 301 a `/boletines.xml`, así los
lectores RSS actualizan la suscripción solos.

## Datos

- **Socios del club:** editar `socios.txt` (un indicativo por línea) y hacer push; el build genera
  la lista (`npm run socios` la regenera en local y avisa de indicativos que no figuran en SUBTEL).
  Desde el navegador, ver [Editar la lista de socios desde GitHub](#editar-la-lista-de-socios-desde-github).
- **Licencias:** `public/data/licencias.json` sale de los listados PDF de SUBTEL con
  `scripts/extract-licencias.py`, a partir de los PDF de SUBTEL copiados en la raíz del repo.
- **Repetidoras, cursos, frecuencias, tablas:** módulos en `src/lib/`.

## Editar la lista de socios desde GitHub

No hace falta instalar nada: basta una cuenta de GitHub con permiso de escritura en este
repositorio.

1. Abrir [`socios.txt`](./socios.txt) y presionar el lápiz (**Edit this file**).
2. Hacer el cambio. Va un indicativo por línea:
   - **Agregar un socio:** escribir su indicativo en una línea nueva. El orden no importa; el sitio
     los ordena por apellido.
   - **Quitar un socio:** borrar su línea.
   - Da lo mismo mayúsculas o minúsculas. Las líneas vacías se ignoran y lo que va después de `#`
     es un comentario.
3. Presionar **Commit changes…**, escribir qué cambió (por ejemplo, «Agrega a CA4XYZ») y dejar
   marcada la opción **Commit directly to the `main` branch**.
4. Netlify publica el cambio solo, en unos minutos. El badge al inicio de este README muestra el
   estado del último deploy.

**Si el deploy falla** (badge en rojo y correo de Netlify), casi siempre es una línea que no es un
indicativo. El registro del deploy en Netlify (**Deploys** → el deploy fallido) indica cuál, por
ejemplo `socios.txt:12: «CA4 XYZ» no es un indicativo`. Basta corregir esa línea siguiendo los mismos
pasos. Mientras tanto, el sitio sigue mostrando la versión anterior.

Un indicativo que no figura en el listado de SUBTEL no hace fallar el deploy: el buscador lo muestra
al final, sin datos de licencia.

Detalle de la arquitectura y convenciones en [AGENTS.md](./AGENTS.md).
