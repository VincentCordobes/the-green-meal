import sql from "sql-template-strings"
import {query} from "../database"

export type Role = "regular" | "admin" | "manager"

export type Person = {
  id: number
  email: string
  password: string
  emailValidated: boolean
  role: Role
  firstname: string
  lastname: string
}

export function findByManagerId(managerId: number): Promise<Person[]> {
  return query<Person>(
    sql`select * from person
        where person.manager_id = ${managerId}`,
  )
}

export function findAll(): Promise<Person[]> {
  return query<Person>(sql`select * from person`)
}

export async function findById(personId: number): Promise<Person> {
  const [person] = await query<Person>(
    sql`select * from person where id = ${personId}`,
  )
  if (!person) {
    throw new Error(`Person ${personId} not found`)
  }
  return person
}

export default {
  findById,
}
