import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseProfile } from './parseProfile.js'

// URL foto diambil dari HTML pihak ketiga lalu disimpan ke database dan dirender sebagai
// <img> di halaman kita. Allowlist host-nya batas kepercayaan, bukan kerapian, jadi diuji.

const page = (avatarTag) => `<html><body>${avatarTag}<h1 class="ql-display-small">Budi Santoso</h1></body></html>`

test('mengambil foto dari host Google yang diizinkan', () => {
  const html = page(`<ql-avatar class='profile-avatar' size='160' src='https://lh3.googleusercontent.com/a/AbC123=s320-c'></ql-avatar>`)
  assert.equal(parseProfile(html).avatar, 'https://lh3.googleusercontent.com/a/AbC123=s320-c')
})

test('menolak host di luar allowlist', () => {
  const html = page(`<ql-avatar src='https://evil.example.com/track.gif'></ql-avatar>`)
  assert.equal(parseProfile(html).avatar, null)
})

test('menolak yang bukan https', () => {
  const html = page(`<ql-avatar src='http://lh3.googleusercontent.com/a/AbC123'></ql-avatar>`)
  assert.equal(parseProfile(html).avatar, null)
})

test('menolak skema javascript dan data', () => {
  for (const bad of ['javascript:alert(1)', 'data:image/svg+xml,<svg onload=alert(1)>']) {
    assert.equal(parseProfile(page(`<ql-avatar src='${bad}'></ql-avatar>`)).avatar, null)
  }
})

test('null kalau profil tidak punya ql-avatar', () => {
  assert.equal(parseProfile(page('')).avatar, null)
})

test('host mirip tapi beda tetap ditolak', () => {
  const html = page(`<ql-avatar src='https://lh3.googleusercontent.com.evil.net/a/x'></ql-avatar>`)
  assert.equal(parseProfile(html).avatar, null)
})

test('badge tetap terbaca saat ada ql-avatar', () => {
  const html = `<html><ql-avatar src='https://lh3.googleusercontent.com/a/x'></ql-avatar>
    <h1 class="ql-display-small">Budi</h1>
    <span class="ql-title-medium"> Cloud Storage </span><span class="ql-body-medium"> Earned Aug 14, 2026 </span></html>`
  const r = parseProfile(html)
  assert.equal(r.name, 'Budi')
  assert.equal(r.badges.length, 1)
  assert.equal(r.badges[0].title, 'Cloud Storage')
})
