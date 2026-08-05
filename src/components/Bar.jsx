// Progress bar milestone.
//
// SENGAJA TANPA framer-motion, jangan dikembalikan. Versi sebelumnya memakai
// `initial={{ scaleX: 0 }}` + `whileInView={{ scaleX: 1 }}`, dan itu gagal DIAM-DIAM: kalau
// observer-nya tidak menyala, `transform: scaleX(0)` menahan bar tetap kosong berapa pun
// lebarnya, tanpa error di mana pun. Bar 8/8 tampil kosong berminggu-minggu dan sebabnya tidak
// kelihatan, karena angka di sebelahnya tetap benar.
//
// Pelajaran yang ongkosnya sudah dibayar: animasi hias tidak boleh jadi syarat munculnya
// informasi. Sekarang lebarnya CSS murni, jadi tidak ada keadaan di mana bar bisa tersangkut
// kosong. Transisi width tetap memberi efek tumbuh saat angkanya berubah, dan kilau
// (.fill-shine) tetap jalan karena itu memang animasi CSS.
export default function Bar({ label, cur, req }) {
  const pct = Math.min(100, (cur / req) * 100)
  return (
    <div className="bar">
      <span>{label}</span>
      <span className="track">
        <span className="fill" style={{ width: pct + '%' }}>
          {pct > 0 && <span className="fill-shine" />}
        </span>
      </span>
      <span className="val">{Math.min(cur, req)} / {req}</span>
    </div>
  )
}
