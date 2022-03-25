import Joi from "@hapi/joi"
import sql from "sql-template-strings"

import {ApiResponse, ApiError} from "../shared/api_types"
import {query} from "./database"
import {Person} from "./person"
import {validate} from "./validate"
import {responseKO, responseOK, ApiRequest} from "./api"

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
