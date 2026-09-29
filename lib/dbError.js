// Pesan error database yang tidak boleh sampai mentah ke peserta.
//
// Kejadiannya nyata dan itu yang memicu seluruh pekerjaan migrasi ini: begitu kuota Neon habis,
// SEMUA endpoint membalas JSON 402 mentah dari driver Neon, lengkap dengan field internalnya
// (neon:retryable, internalQuery, dan seterusnya). Pesan seperti itu tidak memberi tahu peserta
// apa yang harus dilakukan, dan membocorkan detail penyedia database ke publik.

const QUOTA = /exceeded the .*quota|quota exceeded|HTTP status 402|payment required/i

export const QUOTA_MESSAGE = 'Layanan sedang melampaui kapasitas bulanan dan belum pulih. Coba lagi nanti, atau kabari fasilitatormu.'

// { status, message } siap dipakai: res.status(status).json({ error: message }).
export function dbApiError(e, fallbackStatus = 400) {
  const message = String((e && e.message) || '')
  if (QUOTA.test(message)) return { status: 503, message: QUOTA_MESSAGE }
  return { status: fallbackStatus, message: message || 'Gagal memproses.' }
}
