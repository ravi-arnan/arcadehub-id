// Dekorasi background bertema arcade: starfield + pixel space-invader.
// Murni CSS/SVG (tanpa aset gambar), hanya animasi transform/opacity, hormati reduced-motion.

// Grid invader klasik 11x8 (1 = terisi).
const INVADER = [
  '00100000100',
  '00010001000',
  '00111111100',
  '01101110110',
  '11111111111',
  '10111111101',
  '10100000101',
  '00011011000',
]

function Invader({ className, color }) {
  const cells = []
  INVADER.forEach((row, y) => {
    ;[...row].forEach((c, x) => {
      if (c === '1') cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={color} />)
    })
  })
  return (
    <svg className={className} viewBox="0 0 11 8" shapeRendering="crispEdges" aria-hidden="true">{cells}</svg>
  )
}

export default function SpaceFX() {
  return (
    <div className="spacefx" aria-hidden="true">
      <div className="stars stars-a" />
      <div className="stars stars-b" />
      <Invader className="inv inv1" color="rgba(252,201,52,.5)" />
      <Invader className="inv inv2" color="rgba(91,139,255,.5)" />
      <Invader className="inv inv3" color="rgba(52,201,95,.45)" />
    </div>
  )
}
