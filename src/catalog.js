// Lapisan katalog untuk sisi frontend. Datanya sendiri tinggal di lib/ karena serverless
// (api/*) juga memakainya dan tidak boleh mengimpor dari src/. File ini cuma menyatukan
// re-export plus hal-hal yang memang khusus tampilan (gambar badge, URL).
//
// CATATAN ATURAN POIN: completion badge (course biasa) DIHAPUS dari aplikasi ini pada
// 4 Agu 2026. Silabus resmi cuma menghitung "Badge Keahlian", dan menampilkan 497 course
// tanpa poin di katalog yang isinya tentang poin cuma membingungkan peserta. Keputusan
// mana yang berpoin sekarang ada di lib/scoring.js, bukan di sini.
import { SKILL_CATALOG, norm, skillIdByTitle } from '../lib/skillCatalog.js'
import { GAME_CATALOG } from '../lib/gameCatalog.js'

export { SKILL_CATALOG, norm, skillIdByTitle }
export { isSkillBadge, skillEarned } from '../lib/skillCatalog.js'

// Batch terbaru di katalog. Dihitung dari data, bukan dari tanggal hari ini: tanda "BARU" ikut
// isi katalog, tidak akan hilang cuma karena bulan berganti sementara katalog belum diperbarui.
export const NEWEST_BATCH = SKILL_CATALOG.reduce((max, s) => (s.since && s.since > max ? s.since : max), '')
export const isNewSkill = (s) => Boolean(s.since) && s.since === NEWEST_BATCH

// Empat badge GEAR yang wajib selesai untuk klaim Bonus Milestone (+10 poin).
// Sumber: discuss.google.dev/t/arcade-facilitator-2026-bonus-milestone/386412 (31 Jul 2026).
export const GEAR_BADGES = [1586, 1596, 1445, 1682]

// Game bulan-bulan sebelumnya (sudah "Game over", tidak bisa dikerjakan lagi) + bobot poinnya.
export { PAST_GAMES, gamePoints, pastGameImg, pastGameEarned } from '../lib/pastGames.js'

// Game Arcade bulan berjalan. Update bulanan dilakukan di lib/gameCatalog.js, bukan di sini.
export { GAME_CATALOG }

// Skill badge yang punya gambar asli di /public/img/skills/{id}.webp (dari screenshot resmi Google Skills).
// Tambah id di sini saat badge baru dikonversi.
const SKILL_IMG_IDS = new Set([
  623, 624, 625, 626, 627, 628, 629, 632, 633, 634, 635, 636, 637, 638, 639,
  640, 641, 642, 643, 646, 647, 648, 649, 650, 651, 652, 653, 654, 655, 657,
  658, 659, 661, 662, 663, 667, 671, 676, 681, 687, 688, 691, 696, 700, 702,
  704, 705, 714, 715, 716, 725, 726, 727, 728, 737, 749, 750, 751, 752, 753,
  754, 755, 756, 761, 776, 783, 784, 959, 976, 978, 981,
  1164, 1177, 1240, 1337, 1364, 1412, 1426, 1445, 1453, 1459, 1558, 1586, 1596,
])
export const skillImg = (id) => (SKILL_IMG_IDS.has(id) ? `/img/skills/${id}.webp?v=1` : null)

const UTM = '?utm_source=arcade-hub'
export const courseUrl = (id) => `https://www.skills.google/course_templates/${id}${UTM}`
export const gameUrl = (id) => `https://www.skills.google/games/${id}${UTM}`

// Link ke halaman badge di Skills Boost dari judul yang di-earn: game -> halaman game,
// skill badge -> course. null kalau di luar katalog, dan sejak completion badge dihapus itu
// termasuk semua course biasa: badge-nya tetap tampil di Badge Saya, hanya tanpa link.
export const badgeUrl = (title) => {
  const t = title || ''
  const g = GAME_CATALOG.find((x) => x.re.test(t))
  if (g) return gameUrl(g.game)
  const id = skillIdByTitle(t)
  return id ? courseUrl(id) : null
}

