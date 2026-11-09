// Script manual deduplikasi peserta dan normalisasi URL profil ke host kanonik.
// Jalankan manual bila diperlukan, BUKAN di runtime serverless:
//   node scripts/deduplicate-members.mjs
import { getClient } from '../lib/db.js'
import { DEDUPLICATE_MEMBERS_DDL } from '../lib/schema.js'

console.log('Menjalankan deduplikasi peserta manual di Turso...')
const client = getClient()

let step = 1
for (const dml of DEDUPLICATE_MEMBERS_DDL) {
  console.log(`[${step}/${DEDUPLICATE_MEMBERS_DDL.length}] Menjalankan query pembersihan...`)
  const res = await client.execute(dml)
  console.log(`    Baris terpengaruh (rowsAffected): ${res.rowsAffected}`)
  step++
}

console.log('Selesai deduplikasi.')
