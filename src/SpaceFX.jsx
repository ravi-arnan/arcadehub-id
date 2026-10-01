// Dekorasi background bertema arcade: starfield.
// Selama HALLOWEEN (Oktober 2026) ditambah hantu pixel yang berkelana, labu berkedip, dan
// glow oranye, mengikuti halaman Arcade resmi Google yang bulan ini bertema Halloween.
// Murni CSS/SVG (tanpa aset gambar), hanya animasi transform/opacity, hormati reduced-motion.
import { HALLOWEEN } from './config.js'
import { Ghost, Pumpkin } from './halloween.jsx'

export default function SpaceFX() {
  return (
    <div className="spacefx" aria-hidden="true">
      {HALLOWEEN && <div className="hw-glow" />}
      <div className="stars stars-a" />
      <div className="stars stars-b" />
      {/* Hantu yang terbang melintas diletakkan di luar layar oleh keyframes-nya; hantu
          yang mengambang (hwg3) dan labu punya posisi tetap, jadi tetap tampil saat
          reduced-motion (animasinya dimatikan, posisinya tidak). */}
      {HALLOWEEN && (
        <>
          <Ghost className="hw-ghost hwg1" />
          <Ghost className="hw-ghost hwg2" />
          <Ghost className="hw-ghost hwg3" />
          <Pumpkin className="hw-pumpkin hwp1" />
          <Pumpkin className="hw-pumpkin hwp2" />
        </>
      )}
    </div>
  )
}
