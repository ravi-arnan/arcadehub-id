import { test } from 'node:test'
import assert from 'node:assert/strict'
import { LAB_SOLUTIONS, SOLUTION_REPO } from './labSolutions.js'
import { SKILL_CATALOG } from './skillCatalog.js'

// Peta ini di-generate dari README repo lain, jadi yang diuji bukan logikanya melainkan
// keutuhannya: satu id yang meleset mengirim peserta ke runbook lab yang salah, dan itu
// tidak akan terlihat dari tampilan.

test('semua id terpetakan ada di katalog skill badge', () => {
  const ids = new Set(SKILL_CATALOG.map((s) => s.id))
  for (const id of Object.keys(LAB_SOLUTIONS)) {
    assert.ok(ids.has(Number(id)), `id ${id} tidak ada di SKILL_CATALOG`)
  }
})

test('tiap entri punya kode lab dan path berkas', () => {
  for (const [id, v] of Object.entries(LAB_SOLUTIONS)) {
    assert.match(v.code, /^[A-Z]+\d+$/, `kode lab aneh di ${id}`)
    assert.ok(v.path && !v.path.startsWith('/'), `path tidak relatif di ${id}`)
    assert.match(v.path, /\.(md|sh)$/, `path bukan runbook atau script di ${id}`)
    assert.equal(typeof v.verified, 'boolean')
  }
})

test('satu badge tidak menunjuk dua lab, dan satu lab tidak dipakai dua badge', () => {
  const codes = Object.values(LAB_SOLUTIONS).map((v) => v.code)
  assert.equal(new Set(codes).size, codes.length, 'ada kode lab dipakai lebih dari satu badge')
})

test('repo tujuan tidak kosong', () => {
  assert.match(SOLUTION_REPO, /^[\w-]+\/[\w.-]+$/)
})
