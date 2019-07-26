import {NextPage, NextPageContext} from "next"
import React from "react"

import {UserDTO} from "../../shared/user-types"

import Layout from "../../client/layout"
import {UserList} from "../../client/user-list"
import {request} from "../../client/request"
import {ErrorBoundary} from "../../client/error-boundary"
import {withAuth, requestInitialProps} from "../../client/with-auth"

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
