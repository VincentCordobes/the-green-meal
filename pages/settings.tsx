import React from "react"
import {NextPage} from "next"

import {UserDTO} from "../shared/user-types"
import Layout from "../client/layout"
import {withAuth} from "../client/with-auth"
import {ErrorBoundary} from "../client/error-boundary"
import {UserSettings} from "../client/user-settings"

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
