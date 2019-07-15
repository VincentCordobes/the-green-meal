import SQL from "sql-template-strings"
import {query} from "../database"

export type Person = {
  id: number
  email: string
  password: string
  role: "regular" | "admin" | "manager"
  firstname: string
  lastname: string
}

export function findAll(): Promise<Person[]> {
  return query<Person>(SQL`select * from person`)
}

export async function findById(personId: number): Promise<Person> {
  const [person] = await query<Person>(
    SQL`select * from person where id = ${personId}`,
  )
  if (!person) {
    throw new Error(`Person ${personId} not found`)
  }
  return person
}

export default {
  findById,
}
