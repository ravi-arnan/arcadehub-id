// Hero animasi arcade 8-bit (pengganti hero.png): starfield berkedip, bulan mengambang,
// judul "THE ARCADE" glow, sparkle, laser jatuh. Motion transform/opacity; stop saat reduced-motion.
// (Pesawat dihapus dari card ini; kartu fokus ke judul.)

// Bintang deterministik (seed tetap), kecil & halus seperti referensi.
const STARS = (() => {
  let s = 20260713
  const rnd = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff)
  return Array.from({ length: 60 }, () => ({
    x: +(rnd() * 100).toFixed(2), y: +(rnd() * 100).toFixed(2),
    d: +(rnd() * 3).toFixed(2), big: rnd() < 0.12,
  }))
})()

// Sparkle 4-titik kecil.
const Spark = ({ cls }) => <span className={'ah-spark ' + cls} />

export default function ArcadeHero() {
  return (
    <div className="ahero" role="img" aria-label="Google Cloud Arcade">
      <div className="ah-stars">
        {STARS.map((st, i) => (
          <span key={i} className={'ah-star' + (st.big ? ' big' : '')}
            style={{ left: st.x + '%', top: st.y + '%', animationDelay: st.d + 's' }} />
        ))}
      </div>

      <div className="ah-moon" />
      <Spark cls="sp1" />
      <Spark cls="sp2" />
      <Spark cls="sp3" />

      {/* kurung titik-titik dekoratif */}
      <span className="ah-bracket ah-bl" />
      <span className="ah-bracket ah-br" />

      <div className="ah-title">
        <div className="ah-arcade">THE ARCADE</div>
        <div className="ah-gc">Google&nbsp;Cloud</div>
      </div>

      {/* laser biru jatuh (ambient) */}
      <span className="ah-laser la" />
      <span className="ah-laser lb" />
      <span className="ah-laser lc" />
      <span className="ah-laser ld" />
    </div>
  )
}
