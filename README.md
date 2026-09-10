# Radio Club Lircay (CE4LY)

Sitio de [www.ce4ly.cl](https://www.ce4ly.cl): React + Vite, prerender estático,
Tailwind y un service worker para uso offline. El formulario de contacto y el
RSS de boletines se resuelven en el servidor (Node en desarrollo / `npm start`,
PHP en Apache de producción).

## Desarrollo

```sh
cp .env.example .env   # rellenar Mailgun y, si corresponde, SOUNDCLOUD_USER_ID
npm install
npm run dev
npm test
npm run build
```

`npm start` sirve `dist/` en local. En producción basta `npm run deploy`: el
build mete en `dist/` las páginas, el service worker, los PHP y la config
generada desde `.env`. El VPS no necesita más que ese `rsync`.

## Correo (Mailgun)

El formulario en `/contacto` envía a `contacto@ce4ly.cl` con la API HTTP de
Mailgun (`fetch` + autenticación básica; sin SDK). Variables: `MAILGUN_API_KEY`,
`MAILGUN_DOMAIN`, `MAILGUN_API_BASE` (`https://api.mailgun.net` o
`https://api.eu.mailgun.net`) y `CONTACT_TO`. No commitear credenciales.

Con el `.env` relleno, el build escribe `dist/api/mailgun.local.php` (Apache lo
usa; queda bloqueado por `.htaccess` para que no se descargue). No copie
archivos a mano en el servidor.

**DNS.** En Mailgun hay que publicar los registros SPF y DKIM del dominio de
envío. Si `contacto@ce4ly.cl` debe además *recibir* correo (no solo los envíos
del formulario), configure en Mailgun una ruta de recepción hacia el buzón
real.

## Boletines

Con `SOUNDCLOUD_USER_ID` en `.env`, el build escribe `dist/api/boletines.local.php`
y `/feedBoletines.php` reexpone el feed de SoundCloud (caché de 60 minutos; si la
fuente falla, la última copia buena; si no hay ninguna, 503). `/boletines` lista
esos episodios. Si la variable no está, nada se rompe: el feed responde 503 y
la página sigue enlazando el perfil público.
