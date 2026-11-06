import React, { useEffect, useRef } from 'react'

// Dekorasi resmi tema Diwali Google Cloud Arcade (go.cloudskillsboost.google/arcade).
// Menggunakan aset resmi: Pixel Diya, Floating Sky Lantern, dan partikel cahaya melayang (Floating Lights / Glowing Dust).

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
 * Menggunakan variasi delay negatif agar langsung tampak tersebar saat halaman dimuat.
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
    <div className="floating-lantern-wrap sl-4">
      <div className="floating-lantern-inner">
        <SkyLantern />
      </div>
    </div>
    <div className="floating-lantern-wrap sl-5">
      <div className="floating-lantern-inner">
        <SkyLantern />
      </div>
    </div>
  </div>
)

interface DustParticle {
  x: number
  y: number
  size: number
  vy: number
  vx: number
  alpha: number
  baseAlpha: number
  color: string
  phase: number
}

interface FireworkParticle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  alpha: number
  decay: number
  size: number
}

const DUST_COLORS = ['#FFA726', '#FF9933', '#FFD54F']
const FIREWORK_COLORS = ['#4285F4', '#EA4335', '#FFA726', '#34A853']

/**
 * Partikel cahaya melayang (Floating Lights / Glowing Dust) dan kembang api interaktif saat klik
 * Mengikuti sistem partikel resmi halaman Diwali Google Cloud Arcade global.
 */
export const DiwaliFloatingLights: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const isMobile = width < 768
    const numDust = isMobile ? 32 : 65

    const dustParticles: DustParticle[] = []
    for (let i = 0; i < numDust; i++) {
      dustParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 1,
        vy: -(Math.random() * 0.45 + 0.2),
        vx: (Math.random() - 0.5) * 0.3,
        baseAlpha: Math.random() * 0.45 + 0.15,
        alpha: 0.3,
        color: DUST_COLORS[Math.floor(Math.random() * DUST_COLORS.length)],
        phase: Math.random() * Math.PI * 2,
      })
    }

    const fireworks: FireworkParticle[] = []

    const triggerFirework = (x: number, y: number) => {
      const color = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)]
      const count = isMobile ? 22 : 36
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 6 + 2.5
        fireworks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          alpha: 1,
          decay: Math.random() * 0.018 + 0.012,
          size: Math.random() * 1.5 + 2,
        })
      }
    }

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    const handleClick = (e: MouseEvent) => {
      triggerFirework(e.clientX, e.clientY)
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('click', handleClick)

    let animId: number
    let isHidden = false

    const handleVisibility = () => {
      isHidden = document.hidden
    }
    document.addEventListener('visibilitychange', handleVisibility)

    const animate = () => {
      if (!isHidden) {
        ctx.clearRect(0, 0, width, height)

        // Draw magic floating dust (dioptimalkan tanpa shadowBlur agar bebas beban CPU/GPU)
        for (let i = 0; i < dustParticles.length; i++) {
          const p = dustParticles[i]
          p.y += p.vy
          p.x += p.vx
          p.phase += 0.02
          p.alpha = Math.max(0.1, Math.min(0.7, p.baseAlpha + Math.sin(p.phase) * 0.18))

          if (p.y < -10) {
            p.y = height + 10
            p.x = Math.random() * width
          }
          if (p.x < -10) p.x = width + 10
          else if (p.x > width + 10) p.x = -10

          // Pendaran lembut luar
          ctx.globalAlpha = p.alpha * 0.35
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 2.2, 0, Math.PI * 2)
          ctx.fill()

          // Inti cahaya terang
          ctx.globalAlpha = p.alpha
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        }

        // Draw click fireworks
        for (let i = fireworks.length - 1; i >= 0; i--) {
          const f = fireworks[i]
          f.x += f.vx
          f.y += f.vy
          f.vy += 0.05
          f.vx *= 0.98
          f.vy *= 0.98
          f.alpha -= f.decay

          if (f.alpha <= 0) {
            fireworks.splice(i, 1)
            continue
          }

          const baseAlpha = Math.max(0, f.alpha)
          ctx.strokeStyle = f.color
          ctx.lineCap = 'round'

          // Lapisan glow luar
          ctx.globalAlpha = baseAlpha * 0.35
          ctx.lineWidth = f.size * 2
          ctx.beginPath()
          ctx.moveTo(f.x, f.y)
          ctx.lineTo(f.x - f.vx * 2.2, f.y - f.vy * 2.2)
          ctx.stroke()

          // Garis inti kembang api
          ctx.globalAlpha = baseAlpha
          ctx.lineWidth = f.size
          ctx.beginPath()
          ctx.moveTo(f.x, f.y)
          ctx.lineTo(f.x - f.vx * 2.2, f.y - f.vy * 2.2)
          ctx.stroke()
        }
      }
      animId = requestAnimationFrame(animate)
    }

    animId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('click', handleClick)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  return <canvas ref={canvasRef} className="diwali-canvas" aria-hidden="true" />
}

