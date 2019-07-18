import {NextPage, NextPageContext} from "next"
import React from "react"

import Layout from "../../modules/app/layout"
import {
  withAuth,
  requestInitialProps,
} from "../../modules/auth/with-auth-client"
import {ErrorBoundary} from "../../modules/app/error-boundary"
import {UserDTO} from "../../modules/users/types"
import {UserForm} from "../../modules/users/user-form"
import Router from "next/router"
import {useFetch} from "../../modules/use-fetch"
import {request} from "../../modules/http-client"
import {UserFormLayout} from "../../modules/users/user-form-layout"

type Props = {
  users: UserDTO[]
  currentUser?: UserDTO
}

const Index: NextPage<Props> = props => {
  const {data: users} = useFetch<UserDTO[]>("/api/users", {
    initialData: props.users,
  })

  return (
    <ErrorBoundary>
      <Layout currentUser={props.currentUser}>
        <UserFormLayout title="Create a new user">
          <UserForm
            okText="Save"
            onSave={() => Router.push("/users")}
            users={users || props.users}
            withPassword
            withRole
          />
        </UserFormLayout>
      </Layout>
    </ErrorBoundary>
  )
}

Index.getInitialProps = (ctx: NextPageContext): Promise<Props> => {
  return requestInitialProps(
    ctx,
    token => request<UserDTO[]>("/api/users", {token}),
    users => ({users}),
    () => ({users: []}),
  )
}

export default withAuth(Index)
