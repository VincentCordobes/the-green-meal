import {NextPage} from "next"

import LoginForm from "../client/login_form"
import {ErrorBoundary} from "../client/error_boundary"

import styles from "./login.module.css"

type Props = {
  user: string
}
const Index: NextPage<Props> = () => (
  <div className={styles.loginContainer}>
    <ErrorBoundary>
      <LoginForm />
    </ErrorBoundary>
  </div>
)

export default Index
