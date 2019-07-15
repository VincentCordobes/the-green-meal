import {confirmEmail} from "../../../modules/auth/confirm-email"
import {NextApiResponse, NextApiRequest} from "next"
import {withErrorHandler} from "../../../modules/error-handler"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const result = await withErrorHandler(confirmEmail)(req)
  if (result.ok) {
    res.writeHead(302, {Location: "/login?confirmed=true"})
    res.end()
  } else {
    res.statusCode = result.statusCode
    res.json(result)
  }
}
