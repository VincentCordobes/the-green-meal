import {NextPage} from "next"
import LoginForm from "../modules/auth/login-form"
import {ErrorBoundary} from "../modules/app/error-boundary"

import "antd/dist/antd.css"
import "./login.css"
import "../modules/app/style.css"

type Props = {
  user: string
}
const Index: NextPage<Props> = () => (
  <div className="login-container">
    <ErrorBoundary>
      <LoginForm />
    </ErrorBoundary>
  </div>
)

export default Index
