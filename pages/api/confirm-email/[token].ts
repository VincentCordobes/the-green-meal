import {NextApiResponse, NextApiRequest} from "next"

import {confirmEmail} from "../../../server/confirm_email"
import {withErrorHandler} from "../../../server/error_handler"

async function handleConfirmEmail(req: NextApiRequest, res: NextApiResponse) {
  const result = await withErrorHandler(confirmEmail)(req)
  if (result.ok) {
    res.writeHead(302, {Location: "/login?confirmed=true"})
    res.end()
  } else {
    res.statusCode = result.statusCode
    res.json(result)
  }
}

export default handleConfirmEmail
