import {ApiRequest, ApiResponse} from "./api-types"
import Joi from "@hapi/joi"
import {query, DBError, DB_ERROR} from "./database"
import SQL from "sql-template-strings"
import {validate} from "./validate"
import {Person} from "./users/person"
import {hashPassword} from "./auth/auth"
import {head} from "ramda"
import {responseOK, responseKO} from "./api"

export default signup

type SignupRequest = {
  email: string
  password: string
}

type SignupResponse = {
  personId: number
}

async function signup(req: ApiRequest): Promise<ApiResponse<SignupResponse>> {
  const {email, password} = validate<SignupRequest>(
    Joi.object({
      email: Joi.string(),
      password: Joi.string(),
    }),
    req.body,
  )
  const passwordHash = await hashPassword(password)

  return query<Person>(
    SQL`insert into person (email, password) 
        values (${email}, ${passwordHash}) returning id`,
  )
    .then(head)
    .then(person => responseOK({personId: person.id}))
    .catch((e: DBError) => {
      if (e.code === DB_ERROR.uniqueViolation) {
        return responseKO({
          statusCode: 400,
          error: "email already exists",
        })
      }
      throw e
    })
}
