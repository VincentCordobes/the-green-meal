import auth from "../../modules/auth"
import {RequestHandler} from "../../modules/api-types"
import {NextApiRequest, NextApiResponse} from "next"
import {withErrorHandler} from "../../modules/error-handler"

export default handle(withErrorHandler(auth))

function handle<T>(fn: RequestHandler<T>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const result = await fn(req)
    if (result.ok) {
      res.json(result)
    } else {
      res.statusCode = result.statusCode
      res.json(result)
    }
  }
}
