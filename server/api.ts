import {NextApiRequest, NextApiResponse} from "next"
import {IncomingHttpHeaders} from "http"
import {KOResponse, OKResponse, ApiResponse} from "../shared/api-types"
import {withErrorHandler} from "./error-handler"

export type NextHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
) => Promise<void>

export type RequestHandler<T = any, E = any, P = any> = (
  req: ApiRequest,
  params?: P,
) => Promise<ApiResponse<T, E>>

export type ApiRequest<TBody = any, TQuery = any> = {
  body?: TBody
  query?: TQuery
  cookies: Record<string, string>
  headers: IncomingHttpHeaders
}

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

export function responseKO<T>(value: {
  error: T
  statusCode: number
  errorMessage?: string
}): KOResponse<T> {
  return {...value, ok: false}
}
