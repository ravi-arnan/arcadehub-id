// Peserta tanpa guild disimpan backend sebagai 'UMUM' (lihat DEFAULT_GUILD di api/join.js dan
// default kolom di lib/db.js), tapi yang ditampilkan ke pengguna selalu "Umum". Nilai kosong
// ikut diperlakukan sama: baris lama di DB bisa saja null sebelum default kolom dipasang.
export const DEFAULT_GUILD = 'UMUM'

// Kunci kanonik sebuah guild. WAJIB uppercase + trim supaya cocok dengan yang benar-benar
// tersimpan: api/join.js menulis `raw.toUpperCase()` ke database, sedangkan localStorage
// frontend (`gcaf2026_my_guild`) menyimpan apa pun yang diketik peserta apa adanya. Tanpa
// normalisasi di satu tempat ini, kode dari kedua sumber tidak pernah dibandingkan dengan
// benar, dan kegagalannya diam: penanda "guildmu" cuma tidak muncul, tanpa error apa pun.
export const guildKey = (g) => String(g ?? '').trim().toUpperCase() || DEFAULT_GUILD

// Label untuk ditampilkan. Mengembalikan kode ternormalisasi, bukan string mentahnya, supaya
// guild yang sama tidak tampil dua gaya tergantung datanya datang dari DB atau localStorage.
export const guildLabel = (g) => {
  const key = guildKey(g)
  return key === DEFAULT_GUILD ? 'Umum' : key
}
