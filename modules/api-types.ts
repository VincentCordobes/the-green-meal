import {NextApiRequest, NextApiResponse} from "next"
import {IncomingHttpHeaders} from "http"
import {Role} from "./users/person"

export type NextHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
) => Promise<void>

export type RequestHandler<T = any, E = any, P = any> = (
  req: ApiRequest,
  params?: P,
) => Promise<ApiResponse<T, E>>

export type ApiRequest<Body = any, Query = any> = {
  body?: Body
  query?: Query
  cookies: Record<string, string>
  headers: IncomingHttpHeaders
}

export type ApiError = "BadRequest" | "InternalServerError" | "Unauthorized"
export type ApiResponse<T, E = any> = OKResponse<T> | KOResponse<E | ApiError>

export type OKResponse<T> = Readonly<{
  ok: true
  value: T
}>

export type KOResponse<T> = Readonly<{
  ok: false
  error: T
  statusCode: number
  errorMessage?: string
}>
