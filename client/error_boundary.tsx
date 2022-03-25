import React from "react"

type ErrorBoundaryState = {
  error: any
}
export class ErrorBoundary extends React.Component<{}, ErrorBoundaryState> {
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
