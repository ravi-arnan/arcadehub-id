import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  // Tanggal build disuntik saat compile, JANGAN ditulis tangan di komponen: tanggal yang
  // diketik manual pasti basi dan justru berbohong soal kapan situs terakhir diperbarui.
  // Nilainya ISO supaya bisa dipakai atribut <time dateTime>, formatnya diurus di UI.
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
})
