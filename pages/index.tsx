import {NextPage} from "next"
import Layout from "../modules/app/layout"
import {MealList} from "../modules/meals/meals-list.view"
import React from "react"

type Props = {
  user: string
}
const Index: NextPage<Props> = props => (
  <Layout>
    <ErrorBoundary>
      <MealList />
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

// Index.getInitialProps = async () => {
//   const {user} = await fetch("http://localhost:3000/api/user").then(response =>
//     response.json(),
//   )
//   return {user}
// }

export default Index
