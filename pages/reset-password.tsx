import {NextPage} from "next"
import React from "react"
import Row from "antd/lib/row"
import Col from "antd/lib/col"
import Card from "antd/lib/card"

import {ErrorBoundary} from "../client/error-boundary"
import {ResetPasswordForm} from "../client/reset-password-form"

import "antd/dist/antd.css"
import "./reset-password.css"
import "../client/style.css"

type Props = {}

const Index: NextPage<Props> = () => {
  return (
    <ErrorBoundary>
      <Row className="reset-password-container">
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
