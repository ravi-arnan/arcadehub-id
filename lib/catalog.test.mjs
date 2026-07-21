import { test } from 'node:test'
import assert from 'node:assert/strict'
import { badgeUrl, skillEarned, norm } from '../src/catalog.js'

test('badgeUrl: skill by name -> course template', () => {
  assert.equal(badgeUrl('Get Started with Pub/Sub'), 'https://www.skills.google/course_templates/728?utm_source=arcade-hub')
})

test('badgeUrl: game by regex -> halaman game', () => {
  assert.equal(badgeUrl('Arcade Base Camp'), 'https://www.skills.google/games/7313?utm_source=arcade-hub')
})

test('badgeUrl: skill by alias (nama lama Google) -> course sama', () => {
  assert.equal(
    badgeUrl('Implement Event-Driven Messaging and Automation Workflows'),
    'https://www.skills.google/course_templates/728?utm_source=arcade-hub',
  )
})

test('badgeUrl: di luar katalog -> null (tanpa link)', () => {
  assert.equal(badgeUrl('Badge Yang Tidak Ada Di Katalog'), null)
})

test('skillEarned: cocok nama sekarang maupun alias lama', () => {
  const set = new Set([norm('Implement Event-Driven Messaging and Automation Workflows')])
  assert.equal(skillEarned(728, 'Get Started with Pub/Sub', set), true) // via alias
  assert.equal(skillEarned(728, 'Get Started with Pub/Sub', new Set([norm('Get Started with Pub/Sub')])), true) // via nama
  assert.equal(skillEarned(728, 'Get Started with Pub/Sub', new Set([norm('Sesuatu Lain')])), false)
})

test('norm: lowercase + buang non-alfanumerik', () => {
  assert.equal(norm('Get Started with Pub/Sub!'), 'getstartedwithpubsub')
})
