import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { m } from 'framer-motion'
import * as Dialog from '@radix-ui/react-dialog'
import { useMyProfile } from '../profile'
import { TIERS, tierForPoints } from '../points'
import { IconArrowRight, IconMaximize, IconExternalLink, IconX } from '../icons'
import type { SwagTier, SpotlightItem, ExpandedModalItem } from '../types/arcade'

const fmt = (n: number): string => n.toLocaleString('id-ID')

const SWAG_TIERS: SwagTier[] = [
  {
    id: 'trooper',
    name: 'Trooper',
    minPts: 50,
    spots: 6000,
    stars: 1,
    badgeSvg: '/img/arcade/arcade-trooper.svg',
    image: '/img/swags/trooper.webp',
    items: [
      { name: 'The Arcade Travel Bottle', desc: 'Botol stainless steel 5.5 cm ramping, anti-bocor' },
      { name: 'The Arcade Magic Mug', desc: 'Cangkir keramik bunglon dengan desain arcade saat panas' },
    ],
    hasMore: true,
  },
  {
    id: 'ranger',
    name: 'Ranger',
    minPts: 75,
    spots: 4000,
    stars: 2,
    badgeSvg: '/img/arcade/arcade-ranger.svg',
    image: '/img/swags/ranger.webp',
    items: [
      { name: 'The Arcade Backpack', desc: 'Ransel tahan cipratan air dengan slot laptop' },
      { name: 'The Arcade Travel Bottle', desc: 'Botol minum stainless steel ringkas' },
      { name: 'The Arcade Magic Mug', desc: 'Cangkir keramik bunglon bersuhu panas ramah lingkungan' },
    ],
    hasMore: true,
  },
  {
    id: 'champion',
    name: 'Champion',
    minPts: 95,
    spots: 3000,
    stars: 3,
    badgeSvg: '/img/arcade/arcade-champion.svg',
    image: '/img/swags/champion.webp',
    items: [
      { name: 'The Arcade Weather-Shield Jacket', desc: 'Jaket storm-ready berlogo Google Cloud' },
      { name: 'The Arcade PopUp Pro', desc: 'Toolkit saku USB-C multifungsi dan phone stand' },
    ],
    hasMore: true,
  },
  {
    id: 'legend',
    name: 'Legend',
    minPts: 120,
    spots: 2500,
    stars: 4,
    badgeSvg: '/img/arcade/arcade-legend.svg',
    image: '/img/swags/legend.webp',
    items: [
      { name: 'The Arcade Weather-Shield Jacket', desc: 'Jaket storm-ready premium Google Cloud' },
      { name: 'The Arcade PopUp Pro', desc: 'Toolkit saku serbaguna edisi terbatas' },
    ],
    hasMore: true,
  },
]

const SPOTLIGHT_ITEMS: SpotlightItem[] = [
  {
    name: 'The Arcade Magic Mug',
    tiers: 'Trooper & Ranger',
    image: '/img/swags/item-mug.webp',
    forumUrl: 'https://discuss.google.dev/t/swag-drop-the-arcade-magic-mug/407455',
    features: [
      'Desain arcade tersembunyi muncul saat terkena panas',
      'Warna putih minimalis saat suhu dingin',
      'Material solid berbobot mantap dan ramah lingkungan',
    ],
  },
  {
    name: 'The Arcade Travel Bottle',
    tiers: 'Trooper & Ranger',
    image: '/img/swags/item-bottle.webp',
    forumUrl: 'https://discuss.google.dev/t/swag-drop-the-arcade-travel-bottle/405316',
    features: [
      'Profil ramping 5.5 cm',
      'Stainless steel anti-bocor',
      'Tahan suhu panas dan dingin',
    ],
  },
  {
    name: 'The Arcade Backpack',
    tiers: 'Ranger ke atas',
    image: '/img/swags/item-backpack.webp',
    forumUrl: 'https://discuss.google.dev/t/swag-drop-the-arcade-backpack/399232',
    features: [
      'Poliester water-resistant',
      'Kompartemen slot laptop busa',
      'Strap ergonomis breathable',
    ],
  },
  {
    name: 'The Arcade PopUp Pro',
    tiers: 'Champion & Legend',
    image: '/img/swags/item-popup-pro.webp',
    forumUrl: 'https://discuss.google.dev/t/swag-drop-the-arcade-popup-pro/403522',
    features: [
      'Kabel fast-charging USB-C',
      'Adaptor multi-port terpadu',
      'Phone stand dan slot SIM/SD',
    ],
  },
  {
    name: 'The Arcade Weather-Shield Jacket',
    tiers: 'Champion & Legend',
    image: '/img/swags/item-jacket.webp',
    forumUrl: 'https://discuss.google.dev/t/swag-drop-the-arcade-weather-shield-jacket/397353',
    features: [
      'Material tahan angin dan hujan',
      'Kerah protektif risleting halus',
      'Bordir logo resmi Google Cloud',
    ],
  },
]

export default function Prizes() {
  const navigate = useNavigate()
  const { score } = useMyProfile()
  const pts = score?.total || 0
  const myTierIdx = tierForPoints(pts)
  const nextTier = myTierIdx + 1 < TIERS.length ? TIERS[myTierIdx + 1] : null
  const toNext = nextTier ? nextTier.min - pts : 0
  const [expandedItem, setExpandedItem] = useState<ExpandedModalItem | null>(null)

  const handleOpenTier = (tier: SwagTier) => {
    setExpandedItem({
      title: `${tier.name} Tier`,
      meta: `${tier.minPts} Poin · Kuota: ${fmt(tier.spots)} slot`,
      image: tier.image,
      items: tier.items,
      forumUrl: 'https://discuss.google.dev/t/google-skills-arcade-2026-tiers/371066',
    })
  }

  const handleOpenSpotlight = (item: SpotlightItem) => {
    setExpandedItem({
      title: item.name,
      meta: `Tersedia untuk tier ${item.tiers}`,
      image: item.image,
      features: item.features,
      forumUrl: item.forumUrl,
    })
  }

  return (
    <div>
      {/* Header status poin / invite */}
      {score ? (
        <>
          <div className="prizehead">
            <div>
              <div className="lab">Poin kamu</div>
              <div className="big">{pts}</div>
            </div>
            <div className="tier">{myTierIdx >= 0 ? TIERS[myTierIdx].n : 'Belum masuk tier'}</div>
          </div>
          {nextTier ? (
            <div className="nextnote">
              Butuh <b>{toNext}</b> poin lagi untuk mencapai <b>{nextTier.n}</b>.
            </div>
          ) : myTierIdx >= 0 ? (
            <div className="nextnote">Kamu sudah di tier tertinggi. Kunci poinmu secepatnya!</div>
          ) : (
            <div className="nextnote">
              Kumpulkan <b>{TIERS[0].min}</b> poin untuk masuk tier pertama (<b>{TIERS[0].n}</b>).
            </div>
          )}
        </>
      ) : (
        <div className="lb-invite">
          <div>
            <div className="li-t">Belum ada poin kamu</div>
            <div className="li-p">Hitung poinmu dulu untuk melihat tier yang kamu capai.</div>
          </div>
          <button type="button" className="joinbtn" onClick={() => navigate('/points')}>
            Hitung Poin Saya
          </button>
        </div>
      )}

      {/* Kartu Tier Hadiah */}
      <div className="card">
        <h2 className="card-h arcade-tier-title">ARCADE PRIZE TIERS · MUSIM 2026</h2>
        <div className="card-note" style={{ marginTop: 0, marginBottom: 14 }}>
          Merchandise resmi Google Cloud Arcade musim 2026. Penukaran dibuka serentak pada Prize Counter akhir tahun melalui sistem waterfall.
        </div>
        <div className="tier-grid">
          {SWAG_TIERS.map((tier, idx) => {
            const isCurrent = myTierIdx === idx
            const isReached = myTierIdx >= idx

            return (
              <article
                key={tier.id}
                className={'tier-card' + (isCurrent ? ' tier-card--current' : '') + (isReached ? ' tier-card--reached' : '')}
              >
                <div className="tier-badge-header">
                  <div className="tier-stars" aria-label={`${tier.stars} bintang`}>
                    {Array.from({ length: tier.stars }).map((_, i) => (
                      <img key={i} src="/img/arcade/star-arc-prize.svg" alt="" aria-hidden="true" className="tier-star-ic" width="18" height="18" />
                    ))}
                  </div>
                  <img
                    src={tier.badgeSvg}
                    alt={`Arcade ${tier.name}`}
                    className="tier-official-badge"
                    width="64"
                    height="64"
                    loading="lazy"
                  />
                  <img src="/img/arcade/line_img.svg" alt="" className="tier-divider-line" aria-hidden="true" />
                </div>

                <div
                  className="tier-stage"
                  onClick={() => handleOpenTier(tier)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Perbesar merchandise ${tier.name}`}
                  title="Klik untuk memperbesar foto"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleOpenTier(tier)
                    }
                  }}
                >
                  <img
                    src={tier.image}
                    alt={tier.name}
                    className="tier-img"
                    width="400"
                    height="400"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="tier-zoom-badge" aria-hidden="true">
                    <IconMaximize className="tier-zoom-ic" />
                  </span>
                  {isCurrent && <span className="tier-cur-tag">Tier Kamu</span>}
                </div>

                <div className="tier-content">
                  <div className="tier-main-row">
                    <h3 className="tier-name">Arcade {tier.name}</h3>
                    <div className="tier-pts">
                      {tier.minPts} <small>poin</small>
                    </div>
                  </div>

                  <div className="tier-quota">{fmt(tier.spots)} slot kuota</div>

                  <div className="tier-items-list">
                    {tier.items.map((it) => (
                      <div key={it.name} className="tier-item-row">
                        <span className="tier-item-title">{it.name}</span>
                        <span className="tier-item-sub">{it.desc}</span>
                      </div>
                    ))}
                    {tier.hasMore && (
                      <div className="tier-more-note">Item berikutnya diumumkan bertahap</div>
                    )}
                  </div>

                  <button
                    type="button"
                    className="tier-btn"
                    onClick={() => handleOpenTier(tier)}
                  >
                    Lihat Rincian Foto
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </div>

      {/* Kartu Spesifikasi Merchandise */}
      <div className="card">
        <h2 className="card-h">Spesifikasi Merchandise Resmi</h2>
        <div className="card-note" style={{ marginTop: 0, marginBottom: 14 }}>
          Rincian fitur dikutip langsung dari pengumuman tim Google Skills Arcade di forum resmi. Klik kartu untuk melihat foto lebih dekat.
        </div>
        <div className="spotlight-row">
          {SPOTLIGHT_ITEMS.map((item) => (
            <article
              key={item.name}
              className="spotlight-item"
              onClick={() => handleOpenSpotlight(item)}
              role="button"
              tabIndex={0}
              aria-label={`Perbesar ${item.name}`}
              title="Klik untuk melihat foto"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleOpenSpotlight(item)
                }
              }}
            >
              <div className="spotlight-thumb">
                <img
                  src={item.image}
                  alt={item.name}
                  className="spotlight-img"
                  width="200"
                  height="200"
                  loading="lazy"
                  decoding="async"
                />
                <span className="spotlight-badge">{item.tiers}</span>
              </div>

              <div className="spotlight-details">
                <h3 className="spotlight-name">{item.name}</h3>
                <ul className="spotlight-specs">
                  {item.features.map((feat, i) => (
                    <li key={i}>{feat}</li>
                  ))}
                </ul>
                <a
                  href={item.forumUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="spotlight-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  Forum Resmi <IconArrowRight className="spotlight-link-ic" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Mekanisme Penukaran Hadiah */}
      <div className="prizecard">
        <div className="pc-t">Mekanisme Penukaran Hadiah (Prize Counter 2026)</div>
        <ul className="pc-list">
          <li>
            <strong>Single Unified Counter:</strong> Penukaran merchandise dibuka serentak pada satu periode di akhir program 2026.
          </li>
          <li>
            <strong>Sistem Waterfall:</strong> Apabila kuota tier yang kamu capai telah habis terisi, hak klaim kamu otomatis turun ke tier di bawahnya tanpa hangus.
          </li>
          <li>
            <strong>First-Come, First-Served:</strong> Kuota slot terbatas untuk masing-masing tier. Kunci poin kamu lebih awal untuk prioritas tercepat.
          </li>
          <li>
            <strong>Tidak Akumulatif:</strong> Kamu mendapatkan merchandise dari tier tertinggi yang kamu kunci (bukan gabungan semua tier).
          </li>
        </ul>
        <a
          href="https://discuss.google.dev/t/google-skills-arcade-2026-tiers/371066"
          target="_blank"
          rel="noreferrer"
          className="pc-link"
        >
          Pelajari ketentuan resmi di Google Developer Forum <IconExternalLink style={{ width: 13, height: 13, display: 'inline-block', verticalAlign: 'middle', marginLeft: 4 }} />
        </a>
      </div>

      <div className="foot">
        Ambang poin per tier mengikuti pengumuman resmi Google Skills Arcade 2026. Buka tab Poin Saya untuk menghitung poinmu.
      </div>

      {/* Lightbox Modal */}
      <Dialog.Root
        open={Boolean(expandedItem)}
        onOpenChange={(open) => {
          if (!open) setExpandedItem(null)
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay asChild>
            <m.div
              className="sc-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
            />
          </Dialog.Overlay>
          <Dialog.Content asChild aria-describedby={undefined}>
            <m.div
              className="prize-modal"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15 }}
            >
              <Dialog.Close asChild>
                <button type="button" className="prize-modal-x" aria-label="Tutup preview">
                  <IconX className="prize-x-ic" />
                </button>
              </Dialog.Close>

              {expandedItem && (
                <div className="prize-modal-grid">
                  <div className="prize-modal-photo">
                    <img
                      src={expandedItem.image}
                      alt={expandedItem.title}
                      className="pm-img"
                      width="500"
                      height="500"
                    />
                  </div>

                  <div className="prize-modal-info">
                    <Dialog.Title className="pm-title">{expandedItem.title}</Dialog.Title>
                    {expandedItem.meta && <div className="pm-meta">{expandedItem.meta}</div>}

                    {expandedItem.items && expandedItem.items.length > 0 && (
                      <div className="pm-section">
                        <div className="pm-sec-head">Paket Merchandise:</div>
                        <div className="pm-items">
                          {expandedItem.items.map((it) => (
                            <div key={it.name} className="pm-item">
                              <span className="pm-item-name">{it.name}</span>
                              <span className="pm-item-desc">{it.desc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {expandedItem.features && expandedItem.features.length > 0 && (
                      <div className="pm-section">
                        <div className="pm-sec-head">Spesifikasi:</div>
                        <ul className="pm-list">
                          {expandedItem.features.map((feat, i) => (
                            <li key={i}>{feat}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {expandedItem.forumUrl && (
                      <a
                        href={expandedItem.forumUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="joinbtn pm-btn"
                      >
                        Buka Diskusi Resmi <IconExternalLink className="pm-btn-ic" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </m.div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
