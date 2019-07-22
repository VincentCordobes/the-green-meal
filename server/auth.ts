import Joi from "@hapi/joi"
import bcrypt from "bcrypt"
import {SQL} from "sql-template-strings"
import jwt from "jsonwebtoken"

import {ApiResponse} from "../shared/api-types"
import {AuthPayload, AuthResponse, AuthError} from "../shared/auth"

import {query} from "./database"
import {responseKO, responseOK, ApiRequest} from "./api"
import {Person} from "./person"
import {validate} from "./validate"
import {Role} from "../shared/user-types"

const requestSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
})

export async function auth(
  req: ApiRequest,
): Promise<ApiResponse<AuthResponse, AuthError>> {
  const {email, password} = validate<AuthPayload>(requestSchema, req.body)

  const [person] = await query<Person>(
    SQL`select id, password, email_validated, role
        from person
        where email=${email}`,
  )

  if (person) {
    if (!person.emailValidated) {
      return responseKO({
        statusCode: 401,
        error: "UnvalidatedEmail",
        errorMessage: "This accound is not activated",
      })
    }

    const passwordOk = await bcrypt.compare(password, person.password)
    if (passwordOk) {
      return responseOK({
        personId: person.id,
        token: generateAccessToken(person.id, person.role),
      })
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

function generateAccessToken(userId: number, role: Role): string {
  const secret = process.env.AUTH_SECRET
  if (!secret) {
    throw new Error("Missing environment variable AUTH_SECRET ")
  }

  return jwt.sign({userId, role}, secret, {expiresIn: "48h"})
}