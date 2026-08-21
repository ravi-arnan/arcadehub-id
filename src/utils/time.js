// Tanggal singkat Indonesia (mis. "12 Agu 2026").
export const shortDate = (t) => new Date(t).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

// Waktu relatif singkat dalam Bahasa Indonesia (mis. "3 mnt lalu").
export function ago(t) {
  const d = (Date.now() - (typeof t === 'number' ? t : new Date(t).getTime())) / 1000
  if (d < 60) return 'baru saja'
  if (d < 3600) return Math.floor(d / 60) + ' mnt lalu'
  if (d < 86400) return Math.floor(d / 3600) + ' jam lalu'
  return Math.floor(d / 86400) + ' hari lalu'
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

// Tanggal-bulan dari 'YYYY-MM-DD' (kolom `date` Postgres) atau ISO string.
//
// Sengaja TIDAK lewat new Date(): string tanggal-saja diurai sebagai UTC tengah malam, dan
// di zona waktu barat itu tergeser mundur satu hari. Tanggal badge memang cuma tanggal,
// tanpa jam, jadi tidak ada yang perlu dikonversi.
export const dayMonth = (v) => {
  const m = String(v ?? '').match(/^(\d{4})-(\d{2})-(\d{2})/)
  return m ? `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]}` : ''
}
