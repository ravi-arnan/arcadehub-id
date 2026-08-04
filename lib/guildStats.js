import { MS } from './points.js'
import { guildKey, guildLabel } from './guild.js'

// Baris leaderboard datang dari Postgres lewat /api/leaderboard, dan baris lama bisa punya
// kolom yang belum ada saat itu (facil_* baru ditambahkan belakangan lewat ALTER TABLE).
// Jadi tiap angka dipaksa lewat sini, bukan dipakai apa adanya: satu null saja cukup untuk
// mengubah seluruh total jadi NaN dan itu gagal diam-diam di UI.
const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0)

// Rangkum leaderboard jadi satu baris per guild. Murni: tidak menyentuh array masukan.
//
// reached[i] = jumlah peserta yang sudah menembus MS[i], kumulatif menurun, bentuknya sama
// dengan yang sudah dipakai halaman Leaderboard supaya chip milestone bisa dirender sama.
export function guildStats(members) {
  const map = new Map()
  for (const m of members || []) {
    const code = guildKey(m.guild)
    let g = map.get(code)
    if (!g) {
      g = { code, label: guildLabel(m.guild), count: 0, total: 0, best: 0, games: 0, skills: 0, reached: MS.map(() => 0) }
      map.set(code, g)
    }
    const total = num(m.total)
    g.count++
    g.total += total
    g.best = Math.max(g.best, total)
    g.games += num(m.games)
    g.skills += num(m.skills)
    // tier_idx default -1 (belum ada milestone), jadi guard `>= i` sudah cukup.
    const tier = Number.isFinite(Number(m.tier_idx)) ? Number(m.tier_idx) : -1
    for (let i = 0; i < MS.length; i++) if (tier >= i) g.reached[i]++
  }

  return [...map.values()]
    .map((g) => ({ ...g, avg: Math.round((g.total / g.count) * 10) / 10 }))
    // Total dulu. Seri dipecah jumlah peserta menaik: dua guild dengan poin sama tapi
    // pesertanya lebih sedikit berarti rata-ratanya lebih tinggi, jadi taruh lebih dulu.
    // Nama guild jadi pemecah terakhir supaya urutannya stabil antar-render.
    .sort((a, b) => b.total - a.total || a.count - b.count || a.code.localeCompare(b.code))
}
