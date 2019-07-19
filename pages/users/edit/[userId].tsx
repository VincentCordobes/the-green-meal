import {NextPage, NextPageContext} from "next"
import React from "react"

import Layout from "../../../modules/app/layout"
import {
  withAuth,
  requestInitialProps,
} from "../../../modules/auth/with-auth-client"
import {ErrorBoundary} from "../../../modules/app/error-boundary"
import {UserDTO} from "../../../modules/users/types"
import {UserForm} from "../../../modules/users/user-form"
import Router, {useRouter} from "next/router"
import {useFetch} from "../../../modules/use-fetch"
import {request} from "../../../modules/http-client"
import {UserFormLayout} from "../../../modules/users/user-form-layout"

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
