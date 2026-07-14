// Waktu relatif singkat dalam Bahasa Indonesia (mis. "3 mnt lalu").
export function ago(t) {
  const d = (Date.now() - (typeof t === 'number' ? t : new Date(t).getTime())) / 1000
  if (d < 60) return 'baru saja'
  if (d < 3600) return Math.floor(d / 60) + ' mnt lalu'
  if (d < 86400) return Math.floor(d / 3600) + ' jam lalu'
  return Math.floor(d / 86400) + ' hari lalu'
}
