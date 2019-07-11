import {Pool} from "pg"
import {SQLStatement} from "sql-template-strings"

const pool = new Pool({
  database: "the_green_meal",
})

export async function query<T>(sql: SQLStatement): Promise<T[]> {
  try {
    const {rows} = await pool.query(sql)
    return rows
  } catch (e) {
    throw new DBError(e)
  }
}

export class DBError extends Error {
  message: string
  code: string
  hint: string

  constructor(e: {message: string; code: string; hint: string}) {
    super(e.message)
    this.name = "DBError"
    this.message = e.message
    this.code = e.code
    this.hint = e.hint
  }
}
