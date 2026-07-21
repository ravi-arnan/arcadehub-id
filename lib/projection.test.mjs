import test from 'node:test'
import assert from 'node:assert/strict'
import { projectMilestone } from './projection.js'

const START = new Date('2026-07-13T00:00:00+07:00')
const DEADLINE = new Date('2026-09-14T23:59:00+07:00')
const at = (iso) => new Date(iso)
const base = { now: at('2026-08-03T00:00:00+07:00'), deadline: DEADLINE, start: START } // 21 hari berjalan

test('projectMilestone: akun baru menargetkan M1 dengan kebutuhan penuh', () => {
  const p = projectMilestone({ facilGames: 0, facilSkills: 0, ...base })
  assert.equal(p.target.short, 'M1')
  assert.equal(p.needGames, 6)
  assert.equal(p.needSkills, 14)
  assert.equal(p.perWeekActual, 0)
  assert.equal(p.etaDays, null) // tanpa riwayat, tidak bisa diproyeksikan
  assert.equal(p.onTrack, false)
})

test('projectMilestone: kecepatan cukup -> on track dengan perkiraan tanggal', () => {
  // 21 badge / 21 hari = 1 per hari; sisa 7 badge menuju M2 (28) -> 7 hari.
  const p = projectMilestone({ facilGames: 8, facilSkills: 21, ...base })
  assert.equal(p.target.short, 'M2')
  assert.equal(p.needSkills, 7)
  assert.equal(p.etaDays, 7)
  assert.equal(p.onTrack, true)
  assert.ok(p.etaDate < DEADLINE)
})

test('projectMilestone: kecepatan kurang -> tidak on track, butuh lebih cepat', () => {
  // 2 badge / 21 hari; sisa 54 badge menuju ULT jelas tidak terkejar.
  const p = projectMilestone({ facilGames: 12, facilSkills: 2, ...base })
  assert.equal(p.target.short, 'M1')
  assert.equal(p.onTrack, false)
  assert.ok(p.perWeekNeeded > p.perWeekActual)
})

test('projectMilestone: milestone berikutnya naik setelah target terpenuhi', () => {
  const p = projectMilestone({ facilGames: 6, facilSkills: 14, ...base })
  assert.equal(p.target.short, 'M2')
  assert.equal(p.needGames, 2)
  assert.equal(p.needSkills, 14)
})

test('projectMilestone: semua milestone selesai -> done', () => {
  const p = projectMilestone({ facilGames: 12, facilSkills: 56, ...base })
  assert.equal(p.done, true)
  assert.equal(p.target, null)
  assert.equal(p.onTrack, true)
})

test('projectMilestone: kurang game saja tetap on track untuk sisi skill', () => {
  const p = projectMilestone({ facilGames: 0, facilSkills: 14, ...base })
  assert.equal(p.needSkills, 0)
  assert.equal(p.needGames, 6)
  assert.equal(p.etaDays, 0)
  assert.equal(p.onTrack, true)
})

test('projectMilestone: lewat deadline -> sisa hari 0, tidak minus', () => {
  const p = projectMilestone({ facilGames: 0, facilSkills: 0, now: at('2026-10-01T00:00:00+07:00'), deadline: DEADLINE, start: START })
  assert.equal(p.daysLeft, 0)
  assert.equal(p.perWeekNeeded, Infinity)
  assert.equal(p.onTrack, false)
})

test('projectMilestone: hari pertama tidak membagi nol', () => {
  const p = projectMilestone({ facilGames: 0, facilSkills: 2, now: START, deadline: DEADLINE, start: START })
  assert.ok(Number.isFinite(p.perWeekActual))
  assert.ok(p.perWeekActual > 0)
})
