import {NextPage, NextPageContext} from "next"
import Layout from "../modules/app/layout"
import {MealList} from "../modules/meals/meals-list.view"
import React from "react"
import {MealListResponse} from "../modules/meals/meals-types"
import {request} from "../modules/http-client"
import {withAuth} from "../modules/auth/with-auth-client"
import {ErrorBoundary} from "../modules/app/error-boundary"
import {UserDTO} from "../modules/users/types"
import nextCookies from "next-cookies"

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
