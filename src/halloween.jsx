// Dekorasi tema Halloween, dipakai layer background (SpaceFX) dan hero.
// Sengaja SVG, bukan emoji: konvensi repo melarang emoji di UI.
//
// Ghost: pixel-art 14x16 yang sama dipakai halaman Arcade resmi Google (lihat
// go.cloudskillsboost.google/arcade, elemen .spooky-ghost). Warnanya ikut `currentColor`
// supaya glow-nya diatur CSS; dua mata dan mulutnya dilubangi dengan warna latar gelap.
export function Ghost({ className }) {
  return (
    <svg className={className} viewBox="0 0 14 16" shapeRendering="crispEdges" aria-hidden="true">
      <path fill="currentColor" d="M5 0h4v1h2v1h1v1h1v1h1v10h-2v1h-2v-1h-2v1h-2v-1h-2v1h-2v-1h-2v-10h1v-1h1v-1h1v-1h2z" />
      <path fill="#141126" d="M3 5h2v3H3zM9 5h2v3H9z" />
      <path fill="#141126" d="M6 10h2v2H6z" />
    </svg>
  )
}

// Jack-o'-lantern. Bukan pixel-art seperti Ghost (halaman resmi pun memakai pumpkin SVG halus),
// jadi keduanya sengaja beda gaya persis seperti di sana.
export function Pumpkin({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 22" aria-hidden="true">
      <rect x="10.6" y="0.4" width="2.4" height="3.6" rx="1" fill="#6aa84f" />
      <ellipse cx="12" cy="12.4" rx="10.4" ry="8.6" fill="#ff7518" />
      <ellipse cx="12" cy="12.4" rx="6.1" ry="8.3" fill="#ff9634" opacity=".55" />
      <polygon points="7.4,9.1 10.7,9.1 9.05,11.9" fill="#1c0f24" />
      <polygon points="13.3,9.1 16.6,9.1 14.95,11.9" fill="#1c0f24" />
      <path d="M7.3 14.5l1.6 1.5 1.5-1.5 1.6 1.5 1.6-1.5 1.5 1.5 1.6-1.5" stroke="#1c0f24" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
