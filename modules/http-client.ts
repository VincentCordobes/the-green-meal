import fetch from "isomorphic-unfetch"
import {ApiResponse} from "./api-types"

import queryString from "query-string"

const API_URL = process.env.API_URL

export type RequestOptions<T = any> = {
  method: "GET" | "POST" | "PUT"
  body: T
  params: Record<string, any>
  headers: Record<string, string>
  token: string
}
export async function request<T, E = any, B = any>(
  path: string,
  options: Partial<RequestOptions<B>> = {},
): Promise<ApiResponse<T, E>> {
  const defaultOptions = {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...(options.token ? {Authorization: options.token} : {}),
      ...(options.body ? {"Content-Type": "application/json"} : {}),
    },
  }

  const url =
    API_URL +
    path +
    (options.params ? "?" + queryString.stringify(options.params) : "")

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
    body: JSON.stringify(options.body),
  })

  // 500 or any other
  const isCriticalError = (code: number) => ![401, 400].includes(code)

  if (
    !response.ok && // status not in the range 200-299
    isCriticalError(response.status)
  ) {
    throw new HTTPError(response)
  }

  return response.json()
}

class HTTPError extends Error {
  readonly statusCode: number

  constructor(response: Response) {
    super(`${response.status} (${response.statusText})`)
    this.name = "HTTP Error"
    this.statusCode = response.status
  }
}
