import React from 'react'

// Dekorasi tema Halloween resmi Google Cloud Arcade (go.cloudskillsboost.google/arcade).
// Dipakai di background layer (SpaceFX) dan hero (ArcadeHero).
// Murni pixel art SVG crispEdges, tanpa emoji.

export interface HalloweenElementProps {
  className?: string
}

export const Ghost: React.FC<HalloweenElementProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 14 16" shapeRendering="crispEdges" aria-hidden="true">
    <path d="M5 0h4v1h2v1h1v1h1v1h1v10h-2v1h-2v-1h-2v1h-2v-1h-2v1h-2v-1h-2v-10h1v-1h1v-1h1v-1h2z" fill="#FFFFFF" />
    <path d="M4 5h2v3H4zM10 5h2v3H10z" fill="#0D0617" />
    <path d="M7 10h2v3H7z" fill="#0D0617" />
  </svg>
)

export const Pumpkin: React.FC<HalloweenElementProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" shapeRendering="crispEdges" aria-hidden="true">
    <g transform="translate(8, 8) scale(4)">
      <path fill="#1a8b75" d="M10 0h1v1h-1ZM9 1h1v1h-1ZM9 2h1v1h-1ZM8 3h1v1h-1Z" />
      <path fill="#136d5b" d="M10 1h1v1h-1ZM10 2h1v1h-1ZM9 3h2v1h-2Z" />
      <path fill="#a33e00" d="M5 4h2v1h-2ZM3 5h3v1h-3ZM2 6h3v1h-3ZM1 7h3v1h-3ZM1 8h3v1h-3ZM0 9h3v1h-3ZM0 10h3v1h-3ZM0 11h3v1h-3ZM0 12h3v1h-3ZM0 13h3v1h-3ZM0 14h3v1h-3ZM1 15h2v1h-2ZM1 16h3v1h-3ZM2 17h3v1h-3ZM3 18h3v1h-3ZM5 19h2v1h-2ZM7 20h1v1h-1Z" />
      <path fill="#d15100" d="M7 4h3v1h-3ZM6 5h4v1h-4ZM5 6h4v1h-4ZM4 7h4v1h-4ZM4 8h2v1h-2ZM3 9h1v1h-1ZM3 10h1v1h-1ZM3 11h2v1h-2ZM3 12h5v1h-5ZM3 13h5v1h-5ZM3 14h1v1h-1ZM5 14h1v1h-1ZM7 14h1v1h-1ZM3 15h1v1h-1ZM4 16h1v1h-1ZM5 17h2v1h-2ZM6 18h4v1h-4ZM7 19h3v1h-3ZM8 20h2v1h-2Z" />
      <path fill="#ee6800" d="M10 4h2v1h-2ZM10 5h2v1h-2ZM9 6h3v1h-3ZM8 7h4v1h-4ZM9 8h4v1h-4ZM9 9h2v1h-2ZM9 10h2v1h-2ZM8 11h1v1h-1ZM11 11h1v1h-1ZM8 12h1v1h-1ZM8 13h3v1h-3ZM9 14h1v1h-1ZM10 18h2v1h-2ZM10 19h2v1h-2ZM10 20h1v1h-1Z" />
      <path fill="#f78500" d="M12 4h3v1h-3ZM12 5h3v1h-3ZM12 6h4v1h-4ZM12 7h4v1h-4ZM15 8h1v1h-1ZM16 9h1v1h-1ZM16 10h1v1h-1ZM15 11h2v1h-2ZM11 12h6v1h-6ZM11 13h6v1h-6ZM11 14h1v1h-1ZM13 14h1v1h-1ZM15 14h1v1h-1ZM16 16h1v1h-1ZM14 17h2v1h-2ZM12 18h3v1h-3ZM12 19h2v1h-2ZM11 20h1v1h-1Z" />
      <path fill="#ff9f10" d="M15 5h3v1h-3ZM16 6h3v1h-3ZM16 7h4v1h-4ZM16 8h4v1h-4ZM17 9h4v1h-4ZM17 10h4v1h-4ZM17 11h4v1h-4ZM17 12h4v1h-4ZM17 13h4v1h-4ZM17 14h4v1h-4ZM17 15h3v1h-3ZM17 16h3v1h-3ZM16 17h3v1h-3ZM15 18h3v1h-3ZM14 19h2v1h-2ZM12 20h1v1h-1Z" />
      <path fill="#ffcd00" d="M6 8h3v1h-3ZM12 8h3v1h-3ZM4 9h1v1h-1ZM8 9h1v1h-1ZM11 9h1v1h-1ZM15 9h1v1h-1ZM4 10h1v1h-1ZM8 10h1v1h-1ZM11 10h1v1h-1ZM15 10h1v1h-1ZM5 11h3v1h-3ZM9 11h2v1h-2ZM12 11h3v1h-3ZM9 12h2v1h-2ZM4 14h1v1h-1ZM6 14h1v1h-1ZM8 14h1v1h-1ZM10 14h1v1h-1ZM12 14h1v1h-1ZM14 14h1v1h-1ZM16 14h1v1h-1ZM4 15h13v1h-13ZM5 16h11v1h-11ZM7 17h7v1h-7Z" />
      <path fill="#ffff4d" d="M5 9h3v1h-3ZM12 9h3v1h-3ZM5 10h3v1h-3ZM12 10h3v1h-3Z" />
    </g>
  </svg>
)
