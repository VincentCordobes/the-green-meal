import {NextPage, NextPageContext} from "next"
import React from "react"
import Router from "next/router"

import {UserDTO} from "../../shared/user-types"
import Layout from "../../client/layout"
import {withAuth, requestInitialProps} from "../../client/with-auth"
import {ErrorBoundary} from "../../client/error-boundary"
import {UserForm} from "../../client/user-form"
import {useFetch} from "../../client/use-fetch"
import {request} from "../../client/request"
import {UserFormLayout} from "../../client/user-form-layout"

type Props = {
  users: UserDTO[]
  currentUser: UserDTO
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
            currentUser={props.currentUser}
            withPassword
            withRole
          />
        </UserFormLayout>
      </Layout>
    </ErrorBoundary>
  )
}

Index.getInitialProps = (ctx: NextPageContext): Promise<any> => {
  return requestInitialProps(
    ctx,
    token => request<UserDTO[]>("/api/users", {token}),
    users => ({users}),
    () => ({users: []}),
  )
}

export default withAuth(Index)
