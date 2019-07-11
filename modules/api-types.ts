import {NextApiRequest, NextApiResponse} from "next"

export type NextHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
) => Promise<void>

export type RequestHandler<T = any> = (
  req: ApiRequest,
) => Promise<ApiResponse<T>>

export type ApiRequest<Body = any, Params = any> = {
  body?: Body
  params?: Params
}

export type ApiResponse<T> = OKResponse<T> | KOResponse

export type OKResponse<T> = {ok: true} & T

export type KOResponse = {
  ok: false
  error: string
  statusCode: number
}
