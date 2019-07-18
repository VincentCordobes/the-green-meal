import cookie from "js-cookie"
import Router from "next/router"
import {useEffect} from "react"
import {NextPageContext, NextPage} from "next"

function logout() {
  cookie.remove("token")
  Router.push("/login")
}

export const Logout: NextPage = () => {
  useEffect(() => logout, [])

  return <div>Logging out...</div>
}

Logout.getInitialProps = (ctx: NextPageContext) => {
  if (ctx.res) {
    const {res} = ctx
    res.writeHead(302, {
      Location: "/login",
      "set-cookie": "token=; max-age=0",
    })
    res.end()
  } else {
    logout()
  }
  return Promise.resolve({})
}

export default Logout
