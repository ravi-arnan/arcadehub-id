import { test } from 'node:test'
import assert from 'node:assert/strict'
import { dbApiError, QUOTA_MESSAGE } from './dbError.js'

test('error kuota jadi 503 dengan pesan ramah, bukan JSON mentah', () => {
  const e = new Error('Server error (HTTP status 402): {"message":"Your account or project has exceeded the quota. Upgrade your plan to increase limits.","neon:retryable":true}')
  const { status, message } = dbApiError(e, 400)
  assert.equal(status, 503)
  assert.equal(message, QUOTA_MESSAGE)
  assert.ok(!message.includes('neon:retryable'))
  assert.ok(!message.includes('402'))
})

test('error biasa memakai status fallback dan pesan aslinya', () => {
  const { status, message } = dbApiError(new Error('Profil tidak bisa diakses.'), 400)
  assert.equal(status, 400)
  assert.equal(message, 'Profil tidak bisa diakses.')
})

test('status fallback dihormati untuk endpoint yang memakai 500', () => {
  assert.equal(dbApiError(new Error('boom'), 500).status, 500)
})

test('error tanpa message tidak melempar', () => {
  assert.deepEqual(dbApiError(new Error()), { status: 400, message: 'Gagal memproses.' })
  assert.deepEqual(dbApiError(null, 500), { status: 500, message: 'Gagal memproses.' })
})
