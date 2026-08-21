// Perhitungan kecil leaderboard yang dipisah dari komponen supaya bisa diuji.

// Nilai poin unik terdekat di atas `total`, null kalau sudah paling tinggi. Ini lompatan
// peringkat berikutnya yang benar-benar tersedia buat peserta.
export function nextTotalAbove(members, total) {
  return members.reduce((best, p) => (p.total > total && (best === null || p.total < best) ? p.total : best), null)
}
