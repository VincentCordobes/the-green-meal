import {NextPage} from "next"
import LoginForm from "../modules/auth/login-form"

import "antd/dist/antd.css"
import "./login.css"
import "../modules/app/style.css"

type Props = {
  user: string
}
const Index: NextPage<Props> = () => (
  <div className="login-container">
    <LoginForm />
  </div>
)

export default Index
