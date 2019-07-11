import {ApiRequest, ApiResponse} from "./api-types"
import Joi from "@hapi/joi"
import {query, DBError, DB_ERROR} from "./database"
import SQL from "sql-template-strings"
import {validate} from "./validate"
import {Person} from "./person"
import {hashPassword} from "./auth"
import {head} from "ramda"
import {responseOK, responseKO} from "./api"

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
  const passwordHash = await hashPassword(password)

  return query<Person>(
    SQL`insert into person (username, password) 
        values (${username}, ${passwordHash}) returning id`,
  )
    .then(head)
    .then(person => responseOK({personId: person.id}))
    .catch((e: DBError) => {
      if (e.code === DB_ERROR.uniqueViolation) {
        return responseKO({
          statusCode: 400,
          error: "Username already exists",
        })
      }
      throw e
    })
}
