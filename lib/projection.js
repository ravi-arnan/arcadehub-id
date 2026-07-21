import { MS, DEADLINE } from './points.js'
import { FACIL_START } from './parseProfile.js'

const DAY = 864e5
const ms = (d) => (d instanceof Date ? d.getTime() : d)

// Proyeksi milestone: bandingkan kecepatan mengumpulkan skill badge sejauh ini
// dengan kecepatan yang dibutuhkan supaya target tercapai sebelum penutupan.
//
// HANYA skill badge yang diproyeksikan. Game rilis bulanan dengan kuota terbatas,
// jadi kecepatan historis tidak bisa dipakai memprediksinya; kebutuhan game
// dilaporkan terpisah sebagai angka mentah.
//
// ponytail: rata-rata datar (badge dibagi hari berjalan). Cukup untuk sinyal
// "on track atau tidak". Kalau nanti perlu lebih peka terhadap perubahan ritme,
// ganti perDay ke rata-rata bergerak 14 hari dari seasonBadges.
export function projectMilestone({ facilGames = 0, facilSkills = 0, now = Date.now(), deadline = DEADLINE, start = FACIL_START } = {}) {
  const t = ms(now)
  const daysLeft = Math.max(0, Math.ceil((ms(deadline) - t) / DAY))
  const target = MS.find((m) => !(facilGames >= m.g && facilSkills >= m.s)) || null
  if (!target) return { done: true, target: null, daysLeft, needGames: 0, needSkills: 0, perWeekActual: 0, perWeekNeeded: 0, etaDays: null, etaDate: null, onTrack: true }

  const needGames = Math.max(0, target.g - facilGames)
  const needSkills = Math.max(0, target.s - facilSkills)
  // Minimal 1 hari supaya hari pertama tidak bikin pembagian nol.
  const elapsedDays = Math.max(1, (t - ms(start)) / DAY)
  const perDay = facilSkills / elapsedDays
  const perWeekActual = perDay * 7
  const perWeekNeeded = daysLeft > 0 ? (needSkills / daysLeft) * 7 : Infinity
  const etaDays = needSkills === 0 ? 0 : perDay > 0 ? Math.ceil(needSkills / perDay) : null
  return {
    done: false,
    target,
    daysLeft,
    needGames,
    needSkills,
    perWeekActual,
    perWeekNeeded,
    etaDays,
    etaDate: etaDays === null ? null : new Date(t + etaDays * DAY),
    // Tanpa riwayat sama sekali (perDay 0) dianggap belum on track, bukan gagal.
    onTrack: needSkills === 0 || (etaDays !== null && etaDays <= daysLeft),
  }
}
