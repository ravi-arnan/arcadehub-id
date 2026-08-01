// Sistem poin resmi Google Cloud Arcade Fasilitator 2026
// Sumber: rsvp.withgoogle.com/events/arcade-fasilitator-id/sistem-poin
export const MS = [
  { n: 'Milestone 1', short: 'M1', g: 6, s: 14, bonus: 7 },
  { n: 'Milestone 2', short: 'M2', g: 8, s: 28, bonus: 18 },
  { n: 'Milestone 3', short: 'M3', g: 10, s: 42, bonus: 29 },
  { n: 'Ultimate', short: 'ULT', g: 12, s: 56, bonus: 40 },
]
export const BONUS_TASK = 10
export const DEADLINE = new Date('2026-09-14T23:59:00+07:00')

// base = 1 poin/game + 1 poin per 2 skill badge; bonus hanya milestone tertinggi
export function calc(games, skill, bonusTask) {
  const g = Math.max(0, games | 0)
  const s = Math.max(0, skill | 0)
  const base = g + Math.floor(s / 2)
  let idx = -1
  for (let i = 0; i < MS.length; i++) if (g >= MS[i].g && s >= MS[i].s) idx = i
  const mbonus = idx >= 0 ? MS[idx].bonus : 0
  const task = bonusTask ? BONUS_TASK : 0
  return { base, mbonus, task, total: base + mbonus + task, idx }
}

export function tierLabel(idx) {
  return idx >= 0 ? MS[idx].n : 'Belum ada milestone'
}

// Arcade Player prize tiers 2026 (sumber: Google Developer forum "Google Skills Arcade 2026 Tiers").
// Sistem waterfall / first-come: slot terbatas, poin dikunci lebih awal = posisi lebih aman.
export const TIERS = [
  { n: 'Arcade Trooper', min: 50, max: 74, spots: 6000 },
  { n: 'Arcade Ranger', min: 75, max: 94, spots: 4000 },
  { n: 'Arcade Champion', min: 95, max: 119, spots: 3000 },
  { n: 'Arcade Legend', min: 120, max: Infinity, spots: 2500 },
]

// index tier tertinggi yang dicapai poin tsb, atau -1 kalau belum masuk tier mana pun
export function tierForPoints(pts) {
  let idx = -1
  for (let i = 0; i < TIERS.length; i++) if (pts >= TIERS[i].min) idx = i
  return idx
}

// Gabungkan: base poin (dari SEASON) + bonus milestone (dari periode FASILITATOR, rule-based).
// Total poin = base season + bonus milestone. Bonus milestone hanya milestone tertinggi.
// seasonGamePoints = JUMLAH POIN game, bukan jumlah game: game spesial Jan-Jun 2026 bernilai
// 2-3 poin (lihat lib/pastGames.js). Milestone tetap pakai jumlah game, bukan poin.
export function scoreProfile(seasonGamePoints, seasonSkills, facilGames, facilSkills) {
  const base = seasonGamePoints + Math.floor(seasonSkills / 2)
  let milestoneIdx = -1
  for (let i = 0; i < MS.length; i++) if (facilGames >= MS[i].g && facilSkills >= MS[i].s) milestoneIdx = i
  const mbonus = milestoneIdx >= 0 ? MS[milestoneIdx].bonus : 0
  const total = base + mbonus
  return { base, mbonus, milestoneIdx, total }
}

// self-check terhadap contoh resmi
export function _selfTest() {
  const cases = [[6, 14, false, 20], [8, 28, false, 40], [10, 42, false, 60], [12, 56, false, 80], [12, 56, true, 90]]
  return cases.every(([g, s, b, exp]) => calc(g, s, b).total === exp)
}
