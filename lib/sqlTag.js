// @libsql/client tidak punya tagged template seperti neon(), jadi tag `sql` diterjemahkan
// sendiri di sini. Murni (tanpa koneksi) supaya bisa dites tanpa database.

// Aturan yang tidak boleh dilanggar: nilai SELALU lewat placeholder `?` dan tidak pernah
// disambung ke teks SQL. Satu-satunya pengecualian adalah raw(), dan itu hanya untuk potongan
// SQL yang kita tulis sendiri di lib/schema.js, bukan apa pun yang datang dari request.

/**
 * Penanda potongan SQL mentah internal agar tidak bisa dipalsukan lewat JSON request.
 * JSON.parse() hanya menghasilkan plain Object ({}), bukan instance RawSql.
 */
export class RawSql {
  /**
   * @param {string} text - Potongan SQL mentah terpercaya.
   */
  constructor(text) {
    this.rawSql = text
  }
}

/**
 * Membungkus teks SQL terpercaya menjadi instance RawSql.
 * @param {string} text
 * @returns {RawSql}
 */
export const raw = (text) => new RawSql(text)

/**
 * Menerjemahkan tagged template string dan nilainya menjadi format statement libSQL.
 * @param {TemplateStringsArray | string[]} strings
 * @param {any[]} values
 * @returns {{ sql: string, args: any[] }}
 */
export function toStatement(strings, values) {
  let sql = strings[0]
  const args = []
  for (let i = 0; i < values.length; i++) {
    const v = values[i]
    if (v instanceof RawSql) {
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
