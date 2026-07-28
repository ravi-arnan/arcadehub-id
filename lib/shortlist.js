// Shortlist "kerjakan selanjutnya": potong daftar panjang badge yang belum diambil
// jadi beberapa item saja, dan bisa digeser kalau sarannya tidak menarik.
//
// SENGAJA bukan peringkat. Semua badge skill bernilai sama (0,5 poin) dan tidak ada
// sinyal kesulitan/durasi yang bisa di-scrape, jadi mengurutkannya cuma akan
// mengarang prioritas. Yang dikurangi di sini beban memilih, bukan urutannya.
export function pickShortlist(items, offset = 0, count = 4) {
  const total = items.length
  const n = Math.min(count, total)
  if (n <= 0) return []
  // Membungkus ke awal supaya tombol "Ganti saran" tidak pernah kehabisan isi.
  const start = ((offset % total) + total) % total
  return Array.from({ length: n }, (_, i) => items[(start + i) % total])
}
