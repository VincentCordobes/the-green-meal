import React from "react"
import {NextPage} from "next"

import {UserDTO} from "../shared/user_types"
import Layout from "../client/layout"
import {withAuth} from "../client/with_auth"
import {ErrorBoundary} from "../client/error_boundary"
import {UserSettings} from "../client/user_settings"

type Props = {
  currentUser: UserDTO
}

const Index: NextPage<Props> = ({currentUser}) => (
  <ErrorBoundary>
    <Layout currentUser={currentUser}>
      <UserSettings />
    </Layout>
  </ErrorBoundary>
)

export default withAuth(Index)
