import {NextPage, NextPageContext} from "next"
import React from "react"

import Layout from "../../../modules/app/layout"
import {
  withAuth,
  requestInitialProps,
} from "../../../modules/auth/with-auth-client"
import {ErrorBoundary} from "../../../modules/app/error-boundary"
import {UserDTO} from "../../../modules/users/types"
import Card from "antd/lib/card"
import {UserForm} from "../../../modules/users/user-form"
import Router from "next/router"
import {useFetch} from "../../../modules/use-fetch"
import {request} from "../../../modules/http-client"

type Props = {
  users: UserDTO[]
  currentUser?: UserDTO
  selectedUser?: UserDTO
}

const Index: NextPage<Props> = props => {
  const {data: users} = useFetch<UserDTO[]>("/api/users", {
    initialData: props.users,
  })

  return (
    <ErrorBoundary>
      <Layout currentUser={props.currentUser}>
        <Card>
          <h3>Edit</h3>
          <UserForm
            okText="Save"
            users={users || props.users}
            user={props.selectedUser}
            withRole
          />
        </Card>
      </Layout>
    </ErrorBoundary>
  )
}

Index.getInitialProps = (ctx: NextPageContext): Promise<Props> => {
  const {userId} = ctx ? ctx.query : Router.query
  return requestInitialProps(
    ctx,
    token =>
      Promise.all([
        request<UserDTO[]>("/api/users", {token}),
        request<UserDTO>(`/api/users/${userId}`, {token}),
      ]),
    ([users, selectedUser]) => ({users, selectedUser}),
    () => ({users: [], selectedUser: null}),
  )
}

export default withAuth(Index)
