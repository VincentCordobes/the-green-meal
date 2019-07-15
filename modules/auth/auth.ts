import Joi from "@hapi/joi"
import bcrypt from "bcrypt"
import {SQL} from "sql-template-strings"

import {query} from "../database"
import {ApiRequest, ApiResponse} from "../api-types"
import {AuthPayload, AuthResponse, AuthError} from "./auth-types"
import {Person} from "../users/person"
import {validate} from "../validate"
import {responseKO} from "../api"

process.on("unhandledRejection", e => {
  console.log(e)
})

const requestSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
})

export default auth

async function auth(
  req: ApiRequest,
): Promise<ApiResponse<AuthResponse, AuthError>> {
  const {email, password} = validate<AuthPayload>(requestSchema, req.body)

  const [person] = await query<Person>(
    SQL`select id, password from person
        where email=${email}`,
  )

  if (person) {
    const passwordOk = await bcrypt.compare(password, person.password)
    if (passwordOk) {
      return {
        ok: true,
        value: {
          personId: person.id,
          token: "mytoken",
        },
      }
    }
  }

  return responseKO({
    error: "InvalidCredentials",
    statusCode: 401,
    errorMessage: "Wrong email or password",
  })
}

export async function hashPassword(plainPassword: string): Promise<string> {
  const saltRounds = 10
  return bcrypt.hash(plainPassword, saltRounds)
}
