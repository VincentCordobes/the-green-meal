import {NextApiRequest, NextApiResponse} from "next"

export type NextHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
) => Promise<void>

export type RequestHandler<T = any, E = any> = (
  req: ApiRequest,
) => Promise<ApiResponse<T, E>>

export type ApiRequest<Body = any, Query = any> = {
  body?: Body
  query?: Query
}

export type ApiError = "BadRequest" | "InternalServerError"
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
