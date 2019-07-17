import {NextPage} from "next"
import Layout from "../modules/app/layout"
import React from "react"
import {withAuth} from "../modules/auth/with-auth-client"
import {ErrorBoundary} from "../modules/app/error-boundary"
import {UserSettings} from "../modules/users/user-settings"
import {UserDTO} from "../modules/users/types"

type Props = {
  currentUser?: UserDTO
}

const Index: NextPage<Props> = props => (
  <ErrorBoundary>
    <Layout currentUser={props.currentUser}>
      <UserSettings />
    </Layout>
  </ErrorBoundary>
)

// Index.getInitialProps = async (): Promise<Props> => {
//   const response = await request<MealDTO[]>("/api/meals")
//   if (response.ok) {
//     return {
//       meals: response.value,
//     }
//   } else {
//     return {meals: []}
//   }
// }

export default withAuth(Index)
