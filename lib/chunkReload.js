// Keputusan "boleh reload sekali lagi atau tidak" saat lazy chunk gagal dimuat.
//
// Masalahnya: tiap rute di-code-split, nama file-nya ber-hash. Kalau ada tab
// yang kebuka waktu deploy jalan, chunk lama hilang dari server DAN dihapus dari
// cache service worker (activate menghapus cache versi lama). Klik nav
// berikutnya jadi gagal import dan mendarat di layar error, padahal cukup
// refresh. Reload sekali menyembuhkan itu sendiri.
//
// Dipisah ke fungsi murni supaya bisa dites; efek sampingnya ada di App.jsx.
export const CHUNK_RELOAD_KEY = 'arcadehub:chunk-reload-at'

// Jeda minimum antar-reload. Reload berlangsung instan, jadi kegagalan yang
// benar-benar permanen akan menabrak jendela ini dan berhenti (lalu tampil di
// error boundary), sementara deploy berikutnya di sesi yang sama tetap dapat
// kesempatan menyembuhkan diri.
export const CHUNK_RELOAD_COOLDOWN_MS = 10_000

/**
 * @param {number|null} lastAttemptAt epoch ms percobaan terakhir, null kalau belum pernah
 * @param {number} now epoch ms sekarang
 * @returns {boolean}
 */
export function shouldReloadForChunkError(lastAttemptAt, now) {
  if (!lastAttemptAt) return true
  return now - lastAttemptAt > CHUNK_RELOAD_COOLDOWN_MS
}
