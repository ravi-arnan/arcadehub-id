// @libsql/client tidak punya tagged template seperti neon(), jadi tag `sql` diterjemahkan
// sendiri di sini. Murni (tanpa koneksi) supaya bisa dites tanpa database.

// Aturan yang tidak boleh dilanggar: nilai SELALU lewat placeholder `?` dan tidak pernah
// disambung ke teks SQL. Satu-satunya pengecualian adalah raw(), dan itu hanya untuk potongan
// SQL yang kita tulis sendiri di lib/schema.js, bukan apa pun yang datang dari request.

// Penanda potongan SQL mentah, dipakai sebagai ${NOW} di dalam tagged template.
export const raw = (text) => ({ rawSql: text })

// TemplateStringsArray + nilai -> { sql, args }, BENTUK PERSIS yang diminta
// client.execute() dan client.batch(). Sengaja tidak memakai nama `text`: dengan begini
// hasilnya bisa langsung diserahkan ke client tanpa dipetakan lagi, dan salah nama field
// adalah kesalahan yang mudah terjadi dan gejalanya cuma "failed to downcast any to string".
export function toStatement(strings, values) {
  let sql = strings[0]
  const args = []
  for (let i = 0; i < values.length; i++) {
    const v = values[i]
    if (v && v.rawSql !== undefined) {
      sql += v.rawSql
    } else {
      sql += '?'
      // undefined -> null. libSQL menolak undefined, sedangkan `null` berarti SQL NULL.
      args.push(v === undefined ? null : v)
    }
    sql += strings[i + 1]
  }
  return { sql, args }
}
