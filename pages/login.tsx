import {NextPage} from "next"

import LoginForm from "../client/login-form"
import {ErrorBoundary} from "../client/error-boundary"

import "antd/dist/antd.css"
import "./login.css"
import "../client/style.css"

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
