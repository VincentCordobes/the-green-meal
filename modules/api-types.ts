import {NextApiRequest, NextApiResponse} from "next"

export type NextHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
) => Promise<void>

export type RequestHandler<T = any> = (
  req: ApiRequest,
) => Promise<ApiResponse<T>>

export type ApiRequest<Body = any, Query = any> = {
  body?: Body
  query?: Query
}

export type ApiResponse<T> = OKResponse<T> | KOResponse

export type OKResponse<T> = {
  ok: true
  value: T
}

export type KOResponse = {
  ok: false
  error: string
  statusCode: number
}
