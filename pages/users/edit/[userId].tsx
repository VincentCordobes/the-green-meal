import {NextPage, NextPageContext} from "next"
import React from "react"
import Router, {useRouter} from "next/router"

import Layout from "../../../client/layout"
import {withAuth, requestInitialProps} from "../../../client/with-auth-client"
import {ErrorBoundary} from "../../../client/error-boundary"
import {UserDTO} from "../../../shared/user-types"
import {UserForm} from "../../../client/user-form"
import {useFetch} from "../../../client/use-fetch"
import {request} from "../../../client/http-client"
import {UserFormLayout} from "../../../client/user-form-layout"

type Props = {
  users: UserDTO[]
  currentUser: UserDTO
  selectedUser?: UserDTO
}

const Index: NextPage<Props> = props => {
  const router = useRouter()

  const {data: users} = useFetch<UserDTO[]>("/api/users", {
    initialData: props.users,
  })

  const {data: selectedUser, refetch} = useFetch<UserDTO>(
    `/api/users/${router.query.userId}`,
    {initialData: props.selectedUser},
  )

  return (
    <ErrorBoundary>
      <Layout currentUser={props.currentUser}>
        <UserFormLayout title="Edit">
          <UserForm
            okText="Save"
            onSave={refetch}
            users={users || props.users}
            user={selectedUser || props.selectedUser}
            currentUser={props.currentUser}
            withRole
          />
        </UserFormLayout>
      </Layout>
    </ErrorBoundary>
  )
}

Index.getInitialProps = (ctx: NextPageContext): Promise<any> => {
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
