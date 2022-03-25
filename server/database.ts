import {Pool} from "pg"
import {toPairs, fromPairs, map} from "ramda"
import sql, {SQLStatement} from "sql-template-strings"
import {HTTPError} from "./error_handler"

export const DB_ERROR = {
  uniqueViolation: "23505",
}

const pool = new Pool({
  database: process.env.PGDATABASE || "the_green_meal",
})

export function closeDb() {
  return pool.end()
}

export async function query<T>(sql: SQLStatement): Promise<T[]> {
  try {
    const {rows} = await pool.query(sql)
    return rows.map((row) => mapKeys(camelCase, row))
  } catch (e: any) {
    throw new DBError(e)
  }
}

export function execute(sql: string | SQLStatement) {
  return pool.query(sql)
}

export async function queryOne<T>(sqlQuery: SQLStatement): Promise<T> {
  const [result] = await query<T>(sqlQuery)
  if (!result) {
    throw new HTTPError(400)
  }
  return result
}

export function buildUpdateFields<T extends object>(record: T): SQLStatement {
  const entries = Object.entries(record)

  return entries.reduce((sqlQuery, [key, value], i) => {
    sqlQuery.append(`${snakeCase(key)} = `).append(sql`${value} `)

    if (i < entries.length - 1) {
      sqlQuery.append(", ")
    }

    return sqlQuery
  }, sql` `)
}

export function buildValues<T extends object>(record: T): SQLStatement {
  type ColumnsValues = [SQLStatement, SQLStatement]
  const entries = Object.entries(record)

  const [columns, values] = entries.reduce<ColumnsValues>(
    (acc, [key, value], i) => {
      acc[0].append(snakeCase(key))
      acc[1].append(sql`${value}`)

      if (i < entries.length - 1) {
        acc[0].append(", ")
        acc[1].append(", ")
      }
      return acc
    },
    [sql``, sql``],
  )

  return sql` (`
    .append(columns)
    .append(` ) `)
    .append(` values `)
    .append(` ( `)
    .append(values)
    .append(` ) `)
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

function camelCase(value: string): string {
  return value.replace(/_\w/g, (m: string) => m[1].toUpperCase())
}

function snakeCase(text: string) {
  return text
    .replace(/[\w]([A-Z])/g, (m: string) => m[0] + "_" + m[1])
    .toLowerCase()
}

const mapKeys = (fn: (key: string) => string, obj: any): any => {
  return fromPairs(map(([key, value]) => [fn(key), value], toPairs(obj)))
}
