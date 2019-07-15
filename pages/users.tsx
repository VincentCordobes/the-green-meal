import {NextPage, NextPageContext} from "next"
import nextCookies from "next-cookies"
import Layout from "../modules/app/layout"
import {UserList} from "../modules/users/user-list"
import React from "react"
import {request} from "../modules/http-client"
import {UserDTO} from "../modules/users/types"
import Router from "next/router"

type Props = {
  users: UserDTO[]
}

const Index: NextPage<Props> = props => (
  <Layout>
    <ErrorBoundary>
      <UserList users={props.users} />
    </ErrorBoundary>
  </Layout>
)

type ErrorBoundaryState = {
  error: any
}
class ErrorBoundary extends React.Component<{}, ErrorBoundaryState> {
  state = {error: null}

  componentDidCatch(error: any) {
    this.setState({error})
    console.log(error)
  }

  render() {
    if (this.state.error) {
      return <h1>Something went wrong.</h1>
    }

    return this.props.children
  }
}

Index.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  const {token} = nextCookies(ctx)

  const redirectOnError = () =>
    typeof window !== "undefined"
      ? Router.push("/login")
      : ctx.res && ctx.res.writeHead(302, {Location: "/login"}).end()

  if (!token) {
    redirectOnError()
    return {users: []}
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
    return {users: []}
  }
}

export default Index
