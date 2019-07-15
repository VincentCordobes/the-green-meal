import jwt from "jsonwebtoken"
import {Role} from "../users/person"
import {HTTPError} from "../error-handler"
import {RequestHandler, ApiError} from "../api-types"

export function withACLs<T>(
  acls: Role[],
  fn: RequestHandler<T>,
): RequestHandler<T, ApiError> {
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
