import Joi from "@hapi/joi"
import bcrypt from "bcrypt"
import sql from "sql-template-strings"
import jwt from "jsonwebtoken"
import uuid from "uuid"

import {ApiResponse} from "../shared/api-types"
import {
  AuthRequest,
  AuthResponse,
  AuthError,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "../shared/auth"

import {query, execute} from "./database"
import {responseKO, responseOK, ApiRequest} from "./api"
import {Person} from "./person"
import {validate} from "./validate"
import {Role} from "../shared/user-types"
import {sendMail, resetPasswordTemplate} from "./mailing"
import {HTTPError} from "./error-handler"

const requestSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
})

export async function auth(
  req: ApiRequest,
): Promise<ApiResponse<AuthResponse, AuthError>> {
  const {email, password} = validate<AuthRequest>(requestSchema, req.body)

  const [person] = await query<Person>(
    sql`select id, password, email_validated, role
        from person
        where email=${email.toLowerCase()}`,
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

export async function forgotPassword(req: ApiRequest) {
  const {email} = validate<ForgotPasswordRequest>(
    Joi.object({email: Joi.string().email()}),
    req.body,
  )
  const tokenId = uuid.v4()
  const passwordResetToken = generatePasswordResetToken({email, tokenId})

  await execute(sql`update person set 
                    password_reset_token = ${tokenId}`)

  sendMail(email, resetPasswordTemplate(passwordResetToken))

  return responseOK({})
}

export async function resetPassword(req: ApiRequest) {
  const {token, newPassword} = validate<ResetPasswordRequest>(
    Joi.object({
      newPassword: Joi.string(),
      token: Joi.string(),
    }),
    req.body,
  )

  const {email, tokenId} = await verifyPasswordResetToken(token)
  const hashedPassword: string = await hashPassword(newPassword)

  const {rowCount} = await execute(
    sql`update person set 
               password = ${hashedPassword}
         where email = ${email} 
           and password_reset_token=${tokenId}`,
  )

  if (rowCount === 0) {
    throw new HTTPError(400)
  }

  return responseOK({})
}

export async function hashPassword(plainPassword: string): Promise<string> {
  const saltRounds = 10
  return bcrypt.hash(plainPassword, saltRounds)
}

function generateAccessToken(userId: number, role: Role): string {
  const secret = getAuthSecret()

  return jwt.sign({userId, role}, secret, {expiresIn: "48h"})
}

type PasswordResetTokenPayload = {
  email: string
  tokenId: string
}
function generatePasswordResetToken(
  payload: PasswordResetTokenPayload,
): string {
  const secret = getAuthSecret()

  return jwt.sign(payload, secret, {expiresIn: "48h"})
}

function verifyPasswordResetToken(
  token: string,
): Promise<PasswordResetTokenPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getAuthSecret(), (err, decoded) => {
      if (err) {
        return reject(new HTTPError(401))
      }

      return resolve(decoded as PasswordResetTokenPayload)
    })
  })
}

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET
  if (!secret) {
    throw new Error("Missing environment variable AUTH_SECRET ")
  }
  return secret
}
