import { test } from 'node:test'
import assert from 'node:assert/strict'
import { normalizeProfileUrl } from './fetchProfile.js'

const UUID = '12345678-1234-1234-1234-123456789abc'

test('normalizeProfileUrl: URL lengkap -> kanonik', () => {
  assert.equal(
    normalizeProfileUrl(`https://www.cloudskillsboost.google/public_profiles/${UUID}`),
    `https://www.cloudskillsboost.google/public_profiles/${UUID}`,
  )
})

test('normalizeProfileUrl: UUID telanjang -> URL kanonik', () => {
  assert.equal(
    normalizeProfileUrl(UUID),
    `https://www.cloudskillsboost.google/public_profiles/${UUID}`,
  )
})

test('normalizeProfileUrl: host skills.google diterima', () => {
  assert.equal(
    normalizeProfileUrl(`https://skills.google/public_profiles/${UUID}`),
    `https://skills.google/public_profiles/${UUID}`,
  )
})

test('normalizeProfileUrl: http di-upgrade ke https', () => {
  assert.equal(
    normalizeProfileUrl(`http://www.cloudskillsboost.google/public_profiles/${UUID}`),
    `https://www.cloudskillsboost.google/public_profiles/${UUID}`,
  )
})

test('normalizeProfileUrl: SSRF, host di luar allowlist ditolak', () => {
  assert.equal(normalizeProfileUrl(`https://evil.com/public_profiles/${UUID}`), null)
  assert.equal(normalizeProfileUrl(`https://cloudskillsboost.google.evil.com/public_profiles/${UUID}`), null)
})

test('normalizeProfileUrl: path bukan public_profiles -> null', () => {
  assert.equal(normalizeProfileUrl('https://www.cloudskillsboost.google/catalog'), null)
})

test('normalizeProfileUrl: input sampah -> null', () => {
  assert.equal(normalizeProfileUrl('bukan url'), null)
  assert.equal(normalizeProfileUrl(''), null)
  assert.equal(normalizeProfileUrl(null), null)
})
