// Peserta tanpa guild disimpan backend sebagai 'UMUM' (lihat DEFAULT_GUILD di api/join.js dan
// default kolom di lib/db.js), tapi yang ditampilkan ke pengguna selalu "Umum". Nilai kosong
// ikut diperlakukan sama: baris lama di DB bisa saja null sebelum default kolom dipasang.
export const DEFAULT_GUILD = 'UMUM'
export const guildKey = (g) => g || DEFAULT_GUILD
export const guildLabel = (g) => (guildKey(g) === DEFAULT_GUILD ? 'Umum' : g)
