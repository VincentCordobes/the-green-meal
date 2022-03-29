import {NextPage} from "next"

import LoginForm from "../client/login-form"
import {ErrorBoundary} from "../client/error-boundary"

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
