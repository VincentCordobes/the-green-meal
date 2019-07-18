import Joi from "@hapi/joi"
import bcrypt from "bcrypt"
import sql from "sql-template-strings"

import {query} from "../database"
import {ApiRequest, ApiResponse, ApiError} from "../api-types"
import {Person} from "../users/person"
import {validate} from "../validate"
import {responseKO, responseOK} from "../api"

process.on("unhandledRejection", e => {
  console.log(e)
})

type EmailConfirmed = {
  token: string
}

export async function confirmEmail(
  req: ApiRequest,
): Promise<ApiResponse<EmailConfirmed, ApiError>> {
  const {token} = validate<{token: string}>(
    Joi.object({
      token: Joi.string().required(),
    }),
    req.query,
  )

  const [person] = await query<Person>(
    sql`update person 
        set email_validated = true
        where email_validation_token=${token}
        returning email_validated`,
  )

  if (person && person.emailValidated) {
    return responseOK({
      token: "toto",
    })
  }

  return responseKO({
    error: "BadRequest",
    statusCode: 401,
  })
}

export async function hashPassword(plainPassword: string): Promise<string> {
  const saltRounds = 10
  return bcrypt.hash(plainPassword, saltRounds)
}
