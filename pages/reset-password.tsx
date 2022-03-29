import {NextPage} from "next"
import React from "react"
import Row from "antd/lib/row"
import Col from "antd/lib/col"
import Card from "antd/lib/card"

import {ErrorBoundary} from "../client/error-boundary"
import {ResetPasswordForm} from "../client/reset-password-form"

import styles from "./reset-password.module.css"

type Props = {}

const Index: NextPage<Props> = () => {
  return (
    <ErrorBoundary>
      <Row className={styles.resetPasswordContainer}>
        <Col span={12}>
          <Card>
            <h3>Reset password</h3>
            <ResetPasswordForm />
          </Card>
        </Col>
      </Row>
    </ErrorBoundary>
  )
}

export default Index
