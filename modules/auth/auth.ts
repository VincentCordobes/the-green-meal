import Joi from "@hapi/joi"
import bcrypt from "bcrypt"
import {SQL} from "sql-template-strings"

import {query} from "../database"
import {ApiRequest, ApiResponse} from "../api-types"
import {AuthPayload, AuthResponse} from "./auth-types"
import {Person} from "../users/person"
import {validate} from "../validate"

process.on("unhandledRejection", e => {
  console.log(e)
})

const requestSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
})

export default auth

async function auth(req: ApiRequest): Promise<ApiResponse<AuthResponse>> {
  const {username, password} = validate<AuthPayload>(requestSchema, req.body)

  const [person] = await query<Person>(
    SQL`select id, password from person
        where username=${username}`,
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

  return {
    ok: false,
    statusCode: 401,
    error: "Wrong username or password",
  }
}

export async function hashPassword(plainPassword: string): Promise<string> {
  const saltRounds = 10
  return bcrypt.hash(plainPassword, saltRounds)
}
