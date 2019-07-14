import {NextPage} from "next"
import Layout from "../modules/app/layout"
import {UserList} from "../modules/users/user-list"
import React from "react"
import {request} from "../modules/http-client"
import {UserDTO} from "../modules/users/users"

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

Index.getInitialProps = async (): Promise<Props> => {
  const response = await request<UserDTO[]>("/api/users")
  if (response.ok) {
    return {
      users: response.value,
    }
  } else {
    return {users: []}
  }
}

export default Index
