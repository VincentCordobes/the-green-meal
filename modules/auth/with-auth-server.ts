import jwt from "jsonwebtoken"
import {Role} from "../users/person"
import {HTTPError} from "../error-handler"
import {RequestHandler, ApiError, ApiRequest, ApiResponse} from "../api-types"

export function withACLs<T, E>(
  acls: Role[],
  fn: (req: ApiRequest, params: AccessResult) => Promise<ApiResponse<T, E>>,
): RequestHandler<T, E | ApiError> {
  return async req => {
    const user = await checkAccess(
      req.cookies.token || req.headers.authorization,
    )
    if (!acls.includes(user.role)) {
      throw new HTTPError(401)
    }
    return fn(req, user)
  }
}

export type AccessResult = {userId: number; role: Role}
export async function checkAccess(token?: string): Promise<AccessResult> {
  if (!token) {
    throw new HTTPError(401)
  }

  return new Promise((resolve, reject) => {
    if (!process.env.AUTH_SECRET) {
      throw new Error("Missing environment variable AUTH_SECRET ")
    }

    jwt.verify(token, process.env.AUTH_SECRET, (err, decoded) => {
      if (err) {
        return reject(new HTTPError(401))
      }

      return resolve(decoded as AccessResult)
    })
  })
}
