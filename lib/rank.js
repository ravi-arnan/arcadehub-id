// Peringkat leaderboard. Dipisah dari komponen supaya bisa diuji: aturannya kecil tapi
// gampang salah, dan salahnya diam (nomor tetap tampil, cuma nilainya keliru).
//
// Peringkat KOMPETISI, bukan urutan array: poin sama berarti peringkat sama, lalu peserta
// berikutnya melompat sebanyak jumlah yang seri (1, 2, 2, 4). Sebelum ini peringkat diambil
// dari indeks, jadi 12 peserta berpoin 99 mendapat nomor 2 sampai 13 dan yang kebagian 13
// terlihat kalah dari yang kebagian 2 padahal poinnya identik.
//
// `members` HARUS sudah urut menurun berdasarkan `total`, sesuai yang dikirim /api/leaderboard.

// Map id -> peringkat berbasis 0.
export function competitionRanks(members) {
  const map = new Map()
  let rank = 0
  members.forEach((p, i) => {
    if (i === 0 || p.total !== members[i - 1].total) rank = i
    map.set(p.id, rank)
  })
  return map
}

// Map total -> berapa peserta berbagi nilai itu. Dipakai untuk menandai peringkat berbagi.
export function tieCounts(members) {
  const c = new Map()
  members.forEach((p) => c.set(p.total, (c.get(p.total) || 0) + 1))
  return c
}

// Nilai poin unik terdekat di atas `total`, null kalau sudah paling tinggi. Ini lompatan
// peringkat berikutnya yang benar-benar tersedia buat peserta.
export function nextTotalAbove(members, total) {
  return members.reduce((best, p) => (p.total > total && (best === null || p.total < best) ? p.total : best), null)
}
