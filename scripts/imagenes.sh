#!/bin/sh
# Genera los PNG del logo a partir de public/logo-frontpage.svg (rsvg-convert + ImageMagick).
# No corre en el build: se ejecuta a mano al cambiar el logo y los PNG se versionan.
# public/banner.jpg es una pieza aparte y no se toca.
set -eu
cd "$(dirname "$0")/../public"

LOGO=logo-frontpage.svg
FONDO='#172554' # theme_color del manifest (blue-950)

# El logo solo, con las esquinas transparentes.
logo() { rsvg-convert -w "$1" -h "$1" "$LOGO" | magick - -strip "$2"; }

# El logo al `porcentaje` del lado, centrado sobre fondo opaco.
sobre_fondo() {
  lado=$(($1 * $2 / 100))
  rsvg-convert -w "$lado" -h "$lado" "$LOGO" |
    magick -size "$1x$1" "xc:$FONDO" - -gravity center -composite -alpha off -strip "$3"
}

logo 96 logo.png # favicon y logo del JSON-LD
logo 256 logo-frontpage.png
logo 192 icon-192.png
logo 512 icon-512.png
# Maskable: el logo dentro de la zona segura (círculo del 80 % del lado).
sobre_fondo 192 80 icon-maskable-192.png
sobre_fondo 512 80 icon-maskable-512.png
# iOS rellena la transparencia con negro: fondo opaco.
sobre_fondo 180 88 apple-touch-icon.png

# Open Graph (1200×630): el logo nuevo sobre el anterior, un círculo de radio 131 centrado en
# (212, 303). Se puede repetir: siempre cubre el mismo círculo.
rsvg-convert -w 264 -h 264 "$LOGO" |
  magick og-default.png - -geometry +80+171 -composite -alpha off -strip og-default.png

echo 'Imágenes generadas desde' "$LOGO"
