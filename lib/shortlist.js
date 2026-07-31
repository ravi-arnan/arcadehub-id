// Shortlist "kerjakan selanjutnya": potong daftar panjang badge yang belum diambil
// jadi beberapa item saja, dan bisa digeser kalau sarannya tidak menarik.
//
// Fungsi ini TIDAK mengurutkan apa pun, cuma memotong jendela dari `items` sesuai urutan
// yang diberikan pemanggil. Sejak 31 Jul 2026 pemanggilnya (Catalog.jsx) sudah mengurutkan
// berdasarkan level resmi silabus (Pemula -> Menengah -> Lanjutan), jadi jendela ini otomatis
// mulai dari yang paling ringan. Poinnya tetap sama semua (0,5), urutan ini soal beban belajar.
export function pickShortlist(items, offset = 0, count = 4) {
  const total = items.length
  const n = Math.min(count, total)
  if (n <= 0) return []
  // Membungkus ke awal supaya tombol "Ganti saran" tidak pernah kehabisan isi.
  const start = ((offset % total) + total) % total
  return Array.from({ length: n }, (_, i) => items[(start + i) % total])
}
