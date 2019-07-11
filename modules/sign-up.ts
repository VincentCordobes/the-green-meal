import {ApiRequest, ApiResponse} from "./api-types"
import Joi from "@hapi/joi"
import {query} from "./database"
import SQL from "sql-template-strings"
import {validate} from "./validate"
import {Person} from "./person"
import {encryptPassword} from "./auth"

export default signup

type SignupRequest = {
  username: string
  password: string
}

type SignupResponse = {
  personId: number
}

async function signup(req: ApiRequest): Promise<ApiResponse<SignupResponse>> {
  const {username, password} = validate<SignupRequest>(
    Joi.object({
      username: Joi.string(),
      password: Joi.string(),
    }),
    req.body,
  )
  const passwordHash = await encryptPassword(password)

  const [person] = await query<Person>(
    SQL`insert into person (username, password) 
        values (${username}, ${passwordHash}) returning id`,
  )
  return {
    ok: true,
    personId: person.id,
  }
}
