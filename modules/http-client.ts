import fetch from "isomorphic-unfetch"
import {ApiResponse} from "./api-types"

const API_URL = process.env.API_URL

type RequestOptions<T = any> = {
  method: "GET" | "POST" | "PUT"
  body: T
  headers: Record<string, string>
}
export async function request<T>(
  path: string,
  options: Partial<RequestOptions> = {},
): Promise<ApiResponse<T>> {
  const defaultOptions = {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...(options.body ? {"Content-Type": "application/json"} : {}),
    },
  }

  const response = await fetch(API_URL + path, {
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
