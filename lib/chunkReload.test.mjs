import test from 'node:test'
import assert from 'node:assert/strict'
import { shouldReloadForChunkError, CHUNK_RELOAD_COOLDOWN_MS } from './chunkReload.js'

test('reload diizinkan kalau belum pernah dicoba', () => {
  assert.equal(shouldReloadForChunkError(null, 1_000_000), true)
  assert.equal(shouldReloadForChunkError(0, 1_000_000), true)
})

test('reload ditolak kalau baru saja dicoba, supaya tidak jadi loop', () => {
  const now = 1_000_000
  assert.equal(shouldReloadForChunkError(now, now), false)
  assert.equal(shouldReloadForChunkError(now - 1, now), false)
  assert.equal(
    shouldReloadForChunkError(now - CHUNK_RELOAD_COOLDOWN_MS, now),
    false,
    'tepat di batas cooldown masih ditolak',
  )
})

test('reload diizinkan lagi setelah cooldown lewat, untuk deploy berikutnya', () => {
  const now = 1_000_000
  assert.equal(
    shouldReloadForChunkError(now - CHUNK_RELOAD_COOLDOWN_MS - 1, now),
    true,
  )
})
