import React from "react"
import {NextPage, NextPageContext} from "next"
import nextCookies from "next-cookies"

import {MealListResponse} from "../shared/meals-types"
import {UserDTO} from "../shared/user-types"

import Layout from "../client/layout"
import {MealList} from "../client/meals-list"
import {request} from "../client/http-client"
import {withAuth} from "../client/with-auth-client"
import {ErrorBoundary} from "../client/error-boundary"

type Props = {
  meals: MealListResponse
  currentUser: UserDTO
}

const Index: NextPage<Props> = props => (
  <Layout currentUser={props.currentUser}>
    <ErrorBoundary>
      <MealList meals={props.meals} />
    </ErrorBoundary>
  </Layout>
)

Index.getInitialProps = async (ctx: NextPageContext): Promise<any> => {
  const {token} = nextCookies(ctx)
  const response = await request<MealListResponse>("/api/meals", {token})
  if (response.ok) {
    return {meals: response.value}
  } else {
    return {meals: []}
  }
}

export default withAuth(Index)
