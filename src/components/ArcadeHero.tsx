// Banner resmi Google Cloud Arcade global (go.cloudskillsboost.google/arcade)
// Menggunakan banner resmi responsif: header-desktop.webp di desktop dan header-mobile.webp di mobile.

export default function ArcadeHero() {
  return (
    <div className="ahero" role="img" aria-label="Google Cloud Arcade: The Arcade">
      <picture>
        <source
          media="(max-width: 640px)"
          srcSet="/img/arcade/header-mobile.webp"
          width="1200"
          height="836"
        />
        <img
          src="/img/arcade/header-desktop.webp"
          alt="Google Cloud Arcade: The Arcade"
          className="ahero-img"
          width="2400"
          height="548"
          loading="eager"
          decoding="async"
        />
      </picture>
    </div>
  )
}
