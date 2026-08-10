#!/usr/bin/env bash
# Regenerasi ikon PNG dari public/icon.svg. Jalankan setiap kali icon.svg diubah.
#   bash scripts/gen-icons.sh
# Butuh inkscape + imagemagick (convert).
#
# icon.svg punya sudut membulat (rx=96) karena dipakai langsung sebagai favicon tab.
# PNG-nya sengaja PERSEGI penuh: manifest menandai icon-192/512 sebagai "maskable" dan
# iOS memotong apple-touch-icon sendiri, jadi sudut membulat yang di-bake malah bikin
# tepi ganda. Karena itu rx dinolkan dulu sebelum render.
set -euo pipefail
cd "$(dirname "$0")/.."

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
sed 's/rx="96"/rx="0"/' public/icon.svg > "$tmp/square.svg"

for size in 192 512; do
  inkscape "$tmp/square.svg" -o "public/icon-$size.png" -w "$size" -h "$size"
done
inkscape "$tmp/square.svg" -o public/apple-touch-icon.png -w 180 -h 180

# Buang metadata dan turunkan ke palet 8-bit. 64 warna, bukan 16: latarnya gradien, dan pada
# 16 warna ImageMagick men-dither-nya jadi bercak titik yang kelihatan jelas di 512px.
for f in public/icon-192.png public/icon-512.png public/apple-touch-icon.png; do
  convert "$f" -strip -colors 64 PNG8:"$f"
  printf '%s %s\n' "$f" "$(identify -format '%wx%h %B bytes' "$f")"
done
