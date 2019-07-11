import SQL from "sql-template-strings"
import {query} from "./database"

export type Person = {
  id: number
  username: string
  password: string
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
