import {head} from "ramda"
import Joi from "@hapi/joi"

import {HTTPError} from "./error_handler"

export function validate<T>(schema: Joi.Schema, valueToCheck: any): T {
  const {error, value} = schema.validate(valueToCheck, {
    stripUnknown: true,
    presence: "required",
    abortEarly: true,
  })

  if (error) {
    const {message} = head(error.details)!
    throw new HTTPError(400, message)
  }

  return value
}
