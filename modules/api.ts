import {RequestHandler, NextHandler, KOResponse, OKResponse} from "./api-types"
import {withErrorHandler} from "./error-handler"

export function handle<T>(fn: RequestHandler<T>): NextHandler {
  return withNextResponse(withErrorHandler(fn))
}

export function withNextResponse<T>(fn: RequestHandler<T>): NextHandler {
  return async (req, res) => {
    const result = await fn(req)
    if (result.ok) {
      res.json(result)
    } else {
      res.statusCode = result.statusCode
      res.json(result)
    }
  }
}

export function responseOK<T extends object>(value: T): OKResponse<T> {
  return {ok: true, value}
}

export function responseKO(value: {
  error: string
  statusCode: number
}): KOResponse {
  return {...value, ok: false}
}
