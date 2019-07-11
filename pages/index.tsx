import fetch from "isomorphic-unfetch"
import {NextPage} from "next"
import LoginForm from "./login-form"

import "antd/dist/antd.css"
import "./index.css"

type Props = {
  user: string
}
const Index: NextPage<Props> = props => (
  <div className="container">
    <LoginForm />
  </div>
)

Index.getInitialProps = async () => {
  const {user} = await fetch("http://localhost:3000/api/user").then(response =>
    response.json(),
  )
  return {user}
}

export default Index
