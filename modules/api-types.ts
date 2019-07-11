export type RequestHandler<T = any> = (
  req: ApiRequest,
) => Promise<ApiResponse<T>>

export type ApiRequest<Body = any, Params = any> = {
  body?: Body
  params?: Params
}

export type ApiResponse<T> =
  | {ok: true} & T
  | {ok: false; statusCode: number; error: string}
