import {Pool} from "pg"
import {SQLStatement} from "sql-template-strings"

export const DB_NAME = "the_green_meal"

export const DB_ERROR = {
  uniqueViolation: "23505",
}

const pool = new Pool({
  database: DB_NAME,
})

export function closeDb() {
  return pool.end()
}

export async function query<T>(sql: SQLStatement): Promise<T[]> {
  try {
    const {rows} = await pool.query(sql)
    return rows
  } catch (e) {
    throw new DBError(e)
  }
}

export function execute(sql: string) {
  return pool.query(sql)
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
