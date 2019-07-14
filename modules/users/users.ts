import {ApiRequest, ApiResponse} from "../api-types"
import {query} from "../database"
import {responseOK} from "../api"
import {DateTime} from "luxon"
import {validate} from "../validate"
import {propOr, pick, omit, dissoc} from "ramda"
import SQL from "sql-template-strings"
import {Person, findAll} from "./person"

export type UserDTO = Omit<Person, "password">

export async function list(req: ApiRequest): Promise<ApiResponse<UserDTO[]>> {
  const persons = await findAll()
  return responseOK(persons.map(toUserDTO))
}

function toUserDTO(person: Person): UserDTO {
  return dissoc("password", person)
}
