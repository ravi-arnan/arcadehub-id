// Banner resmi Google Cloud Arcade global (go.cloudskillsboost.google/arcade)
// Menggunakan banner resmi responsif November 2026: header-desktop.webp di desktop dan header-mobile.webp di mobile.
// Dilengkapi dekorasi Pixel Diya resmi selama festival Diwali (DIWALI = true).
import { memo } from 'react'
import { DIWALI } from '../config'
import { PixelDiya } from '../diwali'

export default memo(function ArcadeHero() {
  return (
    <div className="ahero" role="img" aria-label="Google Cloud Arcade: The Arcade">
      <picture>
        <source
          media="(max-width: 640px)"
          srcSet="/img/arcade/header-mobile.webp?v=nov2"
          width="1200"
          height="832"
        />
        <img
          src="/img/arcade/header-desktop.webp?v=nov2"
          alt="Google Cloud Arcade: The Arcade"
          className="ahero-img"
          width="2400"
          height="544"
          loading="eager"
          decoding="async"
        />
      </picture>
      {DIWALI && (
        <>
          <div className="ah-diya ah-diya-left" aria-hidden="true">
            <PixelDiya />
          </div>
          <div className="ah-diya ah-diya-right" aria-hidden="true">
            <PixelDiya />
          </div>
        </>
      )}
    </div>
  )
})
