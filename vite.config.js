import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // WAJIB '/', jangan dikembalikan ke './'. Sejak scripts/prerender.mjs menulis halaman ke
  // subdirektori (dist/catalog/index.html dan seterusnya), path aset relatif akan diminta dari
  // /catalog/assets/... yang tidak ada, dan halamannya blank untuk siapa pun yang membuka link
  // langsung. Sisa aplikasi juga sudah memakai path absolut (/manifest.webmanifest,
  // /PressStart2P.woff2, dan seluruh isi public/sw.js), jadi ini sekalian menyeragamkan.
  base: '/',
  // Tanggal build disuntik saat compile, JANGAN ditulis tangan di komponen: tanggal yang
  // diketik manual pasti basi dan justru berbohong soal kapan situs terakhir diperbarui.
  // Nilainya ISO supaya bisa dipakai atribut <time dateTime>, formatnya diurus di UI.
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
})
