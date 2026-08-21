import { useState } from 'react'

// Foto profil peserta dari halaman public profile Cloud Skills Boost.
//
// Foto BOLEH tidak ada dan BOLEH gagal muat (profil dihapus, foto Google diganti privat,
// jaringan peserta memblokir googleusercontent). Dua-duanya jatuh ke inisial, bukan ke
// kotak kosong atau ikon patah.

// Google menyajikan ukuran lewat akhiran `=sNNN-c` di URL. Halaman profil memberi s320,
// dipakai untuk baris selebar 34px itu 100 kali lebih banyak piksel daripada yang perlu,
// dikali 200 baris. Diminta ulang seukuran tampilan (dikali 2 untuk layar retina).
const sized = (url, px) =>
  /(^https:\/\/lh3\.googleusercontent\.com)/.test(url) ? url.replace(/=s\d+(-c)?$/, `=s${px * 2}-c`) : url

// Inisial dari satu atau dua kata pertama. Nama peserta bisa satu kata ("firza") maupun
// panjang; yang diambil huruf pertama kata pertama dan terakhir.
function initials(name) {
  const w = String(name || '').trim().split(/\s+/).filter(Boolean)
  if (w.length === 0) return '?'
  const first = w[0][0]
  return (w.length === 1 ? first : first + w[w.length - 1][0]).toUpperCase()
}

// Warna latar diturunkan dari nama, bukan acak: peserta yang sama selalu dapat warna sama,
// termasuk setelah reload dan di perangkat lain.
const HUES = [255, 210, 160, 45, 12, 285]
const hueOf = (name) => {
  let h = 0
  for (const c of String(name || '')) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return HUES[h % HUES.length]
}

export default function Avatar({ src, name, size = 34, className = '' }) {
  const [failed, setFailed] = useState(false)
  const style = { width: size, height: size }

  if (!src || failed) {
    return (
      <span className={'avat avat-i ' + className} style={{ ...style, '--ah': hueOf(name) }}
        aria-hidden title={name}>
        {initials(name)}
      </span>
    )
  }
  return (
    <img className={'avat ' + className} style={style} src={sized(src, size)} alt=""
      width={size} height={size} loading="lazy" decoding="async"
      // no-referrer: tanpa ini tiap muat foto mengirim URL halaman kita ke Google.
      referrerPolicy="no-referrer" onError={() => setFailed(true)} />
  )
}
