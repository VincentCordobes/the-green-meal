import {RequestHandler} from "./api-types"
import logger from "./logger"

export function withErrorHandler<T>(fn: RequestHandler<T>): RequestHandler<T> {
  return async req => {
    try {
      const res = await fn(req)
      return res
    } catch (e) {
      if (e.statusCode === 400) {
        return {
          ok: false,
          statusCode: e.statusCode,
          error: e.message,
        }
      } else {
        if (process.env.NODE_ENV === "development") {
          logger.info(e)
        }
        return {
          ok: false,
          statusCode: 500,
          error: "Oops something went wrong",
        }
      }
    }
  }
}

export class HTTPError extends Error {
  readonly statusCode: number

  constructor(statusCode: number, message?: string) {
    super(message)
    this.statusCode = statusCode
  }
}
