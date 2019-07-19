import {NextPage, NextPageContext} from "next"
import React from "react"

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
  currentUser: UserDTO
}

const Index: NextPage<Props> = props => (
  <ErrorBoundary>
    <Layout currentUser={props.currentUser}>
      <UserList users={props.users} />
    </Layout>
  </ErrorBoundary>
)

Index.getInitialProps = (ctx: NextPageContext): Promise<any> => {
  return requestInitialProps(
    ctx,
    token => request<UserDTO[]>("/api/users", {token}),
    value => ({users: value}),
    () => ({users: []}),
  )
}

export default withAuth(Index)
