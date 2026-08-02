// Pencarian nama peserta di leaderboard.
//
// Dinormalkan di kedua sisi — huruf dikecilkan dan spasi beruntun dirapatkan —
// supaya "  alfa   kautsar " tetap menemukan "Alfa Kautsar". Nama yang diketik
// peserta sendiri sering punya spasi ganda, jadi ini bukan kasus teoretis.
const norm = (s) => String(s ?? '').toLowerCase().replace(/\s+/g, ' ').trim()

// Cocok substring, bukan awalan: orang lebih sering ingat penggalan nama
// belakang ketimbang huruf pertama.
export function searchMembers(members, query) {
  const q = norm(query)
  // Daftar aslinya dikembalikan apa adanya, bukan salinan: query kosong adalah
  // keadaan normal, dan referensi yang sama menghemat render ulang di React.
  if (!q) return members
  return members.filter((m) => norm(m.name).includes(q))
}
