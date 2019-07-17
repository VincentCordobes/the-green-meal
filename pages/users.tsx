import {NextPage, NextPageContext} from "next"
import nextCookies from "next-cookies"
import Layout from "../modules/app/layout"
import {UserList} from "../modules/users/user-list"
import React from "react"
import {request} from "../modules/http-client"
import {UserDTO} from "../modules/users/types"
import Router from "next/router"
import {ErrorBoundary} from "../modules/app/error-boundary"
import {withAuth} from "../modules/auth/with-auth-client"

type Props = {
  users: UserDTO[]
  currentUser?: UserDTO
}

const Index: NextPage<Props> = props => (
  <ErrorBoundary>
    <Layout currentUser={props.currentUser}>
      <UserList users={props.users} />
    </Layout>
  </ErrorBoundary>
)

Index.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  const {token} = nextCookies(ctx)

  const redirectOnError = () => {
    if (ctx.res) {
      ctx.res.writeHead(302, {Location: "/login"})
      ctx.res.end()
    } else {
      Router.push("/login")
    }
    return {users: []}
  }

  if (!token) {
    return redirectOnError()
  }

  const response = await request<UserDTO[]>("/api/users", {
    headers: {
      Authorization: token,
    },
  })

  if (response.ok) {
    return {
      users: response.value,
    }
  } else {
    return redirectOnError()
  }
}

export default withAuth(Index)
