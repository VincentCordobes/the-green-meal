import sql from "sql-template-strings"
import {query} from "./database"
import {Role} from "../shared/user_types"

export type Person = {
  id: number
  email: string
  password: string
  emailValidated: boolean
  emailValidationToken: string
  managerId: number | null
  role: Role
  firstname: string
  lastname: string
  expectedCaloriesPerDay: number | null
}

export function findByManagerId(managerId: number): Promise<Person[]> {
  return query<Person>(
    sql`select * from person
        where person.manager_id = ${managerId}
        order by lower(email) asc`,
  )
}

export function findAll(): Promise<Person[]> {
  return query<Person>(
    sql`select * from person
        order by lower(email) asc`,
  )
}

export async function findById(personId: number): Promise<Person> {
  const [person] = await query<Person>(
    sql`select * from person where id = ${personId}
        order by lower(email) asc`,
  )
  if (!person) {
    throw new Error(`Person ${personId} not found`)
  }
  return person
}

export default {
  findById,
  findByManagerId,
  findAll,
}
