import React from 'react'

// Dekorasi resmi tema Diwali Google Cloud Arcade (go.cloudskillsboost.google/arcade).
// Menggunakan aset pixel art 8-bit resmi: Pixel Diya dan Floating Sky Lantern.

export interface DiyaProps {
  className?: string
  style?: React.CSSProperties
}

/**
 * Pixel Diya SVG 8-bit resmi Google Cloud Arcade
 * Dilengkapi animasi api berkedip (flameFlicker) dan gerakan mengambang halus (diyaBob).
 */
export const PixelDiya: React.FC<DiyaProps> = ({ className, style }) => (
  <svg
    className={`pixel-diya-svg ${className || ''}`}
    style={style}
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Diwali Diya"
  >
    <g className="svg-flame">
      <rect x="7" y="1" width="2" height="2" fill="#F57F17" />
      <rect x="6" y="3" width="4" height="2" fill="#F57F17" />
      <rect x="5" y="5" width="6" height="3" fill="#F57F17" />
      <rect x="6" y="8" width="4" height="2" fill="#F57F17" />
      <rect x="7" y="4" width="2" height="4" fill="#FFEB3B" />
      <rect x="6" y="5" width="4" height="2" fill="#FFEB3B" />
      <rect x="7" y="5" width="2" height="2" fill="#FFF9C4" />
    </g>
    <g className="svg-base">
      <rect x="4" y="10" width="8" height="1" fill="#C62828" />
      <rect x="2" y="11" width="12" height="1" fill="#E53935" />
      <rect x="1" y="12" width="14" height="1" fill="#D32F2F" />
      <rect x="3" y="13" width="10" height="1" fill="#B71C1C" />
      <rect x="4" y="14" width="8" height="1" fill="#7F0000" />
    </g>
  </svg>
)

/**
 * Floating Sky Lantern SVG 8-bit resmi Google Cloud Arcade
 */
export const SkyLantern: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 26 31"
    xmlns="http://www.w3.org/2000/svg"
    className={`floating-lantern-svg ${className || ''}`}
    role="img"
    aria-label="Sky Lantern"
  >
    {/* Dark Outline */}
    <path fill="#8c2222" d="M5 0h14v1H5zm-3 1h20v2H2zM1 3h24v17H1zm1 17h22v3H2zm1 3h20v2H3z" />
    {/* Main Red Fill */}
    <path fill="#df3e3e" d="M6 1h12v1H6zm-2 1h16v1H4zm-1 1h18v15H3zm1 15h16v2H4z" />
    {/* Darker Red Shading */}
    <path fill="#bc2e2e" d="M4 2h2v1H4zm-1 1h2v15H3zm1 15h2v2H4z" />
    {/* Highlight Line */}
    <path fill="#f27272" d="M17 2h1v1h-1zm1 1h1v3h-1zm1 3h1v9h-1zm-1 9h1v2h-1z" />
    {/* Pink Dither */}
    <path
      fill="#f69797"
      d="M5 16h1v1H5zm2 0h1v1H7zm2 0h1v1H9zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm-9 1h1v1H6zm2 0h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm-9 1h1v1H7zm2 0h1v1H9zm2 0h1v1h-1zm2 0h1v1h-1z"
    />
    {/* Orange/Yellow Dither */}
    <path
      fill="#f6cb3c"
      d="M6 18h1v1H6zm2 0h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm-3 1h1v1h-1zm-2 0h1v1H9zm-2 0h1v1H7z"
    />
    {/* Bright Yellow Fills */}
    <path
      fill="#f8df60"
      d="M7 19h1v2H7zm2 0h1v2H9zm2 0h1v2h-1zm2 0h1v2h-1zM6 20h1v1H6zm2 0h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1z"
    />
    {/* Rim */}
    <path fill="#444f56" d="M2 22h22v1H2zm-1 1h2v2H1zm22 0h2v2h-2z" />
    {/* Basket Base */}
    <path fill="#de8922" d="M3 23h20v3H3z" />
    {/* Basket Bottom Shadow */}
    <path fill="#b56910" d="M3 25h20v2H3zm1 2h18v1H4z" />
    {/* Candle Center / Flame */}
    <path className="sky-lantern-flame" fill="#fbe67f" d="M11 23h4v1h-4zm-1 1h6v3h-6zm1 3h4v1h-4z" />
  </svg>
)

/**
 * Sky lanterns yang melayang perlahan di latar belakang
 */
export const DiwaliSkyLanterns: React.FC = () => (
  <div className="diwali-sky-lanterns" aria-hidden="true">
    <div className="floating-lantern-wrap sl-1">
      <div className="floating-lantern-inner">
        <SkyLantern />
      </div>
    </div>
    <div className="floating-lantern-wrap sl-2">
      <div className="floating-lantern-inner">
        <SkyLantern />
      </div>
    </div>
    <div className="floating-lantern-wrap sl-3">
      <div className="floating-lantern-inner">
        <SkyLantern />
      </div>
    </div>
  </div>
)
