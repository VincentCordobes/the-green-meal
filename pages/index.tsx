import {NextPage} from "next"
import Layout from "../modules/app/layout"
import {MealList} from "../modules/meals/meals-list.view"
import React from "react"
import {MealDTO} from "../modules/meals/meals-types"
import {request} from "../modules/http-client"
import {withAuth} from "../modules/auth/with-auth-client"

type Props = {
  meals: MealDTO[]
}

const Index: NextPage<Props> = props => (
  <Layout>
    <ErrorBoundary>
      <MealList meals={props.meals} />
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
  const response = await request<MealDTO[]>("/api/meals")
  if (response.ok) {
    return {
      meals: response.value,
    }
  } else {
    return {meals: []}
  }
}

export default withAuth(Index)
