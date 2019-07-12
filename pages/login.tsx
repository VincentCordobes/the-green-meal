import {NextPage} from "next"
import LoginForm from "../modules/auth/login-form"

import "antd/dist/antd.css"
import "./login.css"
import "../modules/app/style.css"

type Props = {
  user: string
}
const Index: NextPage<Props> = props => (
  <div className="login-container">
    <LoginForm />
  </div>
)

// Index.getInitialProps = async () => {
//   const {user} = await fetch("http://localhost:3000/api/user").then(response =>
//     response.json(),
//   )
//   return {user}
// }

export default Index
