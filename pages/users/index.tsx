import {NextPage, NextPageContext} from "next"
import Router from "next/router"
import React from "react"
import nextCookies from "next-cookies"

import Layout from "../../modules/app/layout"
import {UserList} from "../../modules/users/user-list"
import {request} from "../../modules/http-client"
import {UserDTO} from "../../modules/users/types"
import {ErrorBoundary} from "../../modules/app/error-boundary"
import {
  withAuth,
  requestInitialProps,
} from "../../modules/auth/with-auth-client"

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

Index.getInitialProps = (ctx: NextPageContext): Promise<Props> => {
  return requestInitialProps(
    ctx,
    token => request<UserDTO[]>("/api/users", {token}),
    value => ({users: value}),
    () => ({users: []}),
  )
}

export default withAuth(Index)
