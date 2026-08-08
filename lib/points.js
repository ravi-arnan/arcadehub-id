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

// Pecah total poin jadi asal-usulnya, untuk ditampilkan ke peserta.
//
// seasonGamePoints tidak disimpan di DB (kolomnya cuma games/skills/base/mbonus), tapi bisa
// diturunkan persis dari base: base = gamePoints + floor(skills/2). Jadi TIDAK perlu migrasi
// kolom baru maupun fetch ulang profil cuma untuk memisahkan angkanya.
//
// task (+10 Bonus AI Agent) sengaja di luar `total`: klaimnya manual dan lokal, tidak masuk
// leaderboard. Lihat components/BonusMilestone.jsx.
export function pointBreakdown({ base = 0, skills = 0, mbonus = 0 } = {}, bonusTaskDone = false) {
  const s = Math.max(0, skills | 0)
  const skillPoints = Math.floor(s / 2)
  const gamePoints = Math.max(0, (base | 0) - skillPoints)
  const task = bonusTaskDone ? BONUS_TASK : 0
  const total = gamePoints + skillPoints + (mbonus | 0)
  return {
    gamePoints,
    skillPoints,
    skillLeftover: s % 2, // 1 = ada satu badge yang belum berpasangan, tinggal 1 lagi untuk +1 poin
    mbonus: mbonus | 0,
    task,
    total,
    grandTotal: total + task,
  }
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
