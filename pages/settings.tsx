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

const Index: NextPage<Props> = ({currentUser}) => (
  <ErrorBoundary>
    <Layout currentUser={currentUser}>
      <UserSettings />
    </Layout>
  </ErrorBoundary>
)

export default withAuth(Index)
