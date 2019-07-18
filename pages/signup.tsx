import {NextPage} from "next"
import React from "react"
import {ErrorBoundary} from "../modules/app/error-boundary"
import Row from "antd/lib/row"
import Col from "antd/lib/col"
import Card from "antd/lib/card"
import Form from "antd/lib/form"
import Router from "next/router"

import {UserForm} from "../modules/users/user-form"
import Link from "next/link"

import "antd/dist/antd.css"
import "./signup.css"
import "../modules/app/style.css"

type Props = {}

const Index: NextPage<Props> = () => (
  <ErrorBoundary>
    <Row className="signup-container">
      <Col
        xs={{span: 24}}
        md={{span: 16, offset: 4}}
        lg={{span: 12, offset: 6}}
      >
        <Card>
          <h3>Signup</h3>
          <UserForm
            okText="Signup"
            onSave={() => Router.push("/login?pending=true")}
            users={[]}
          />
          <Form.Item
            wrapperCol={{
              sm: {span: 24, offset: 6},
            }}
          >
            Or{" "}
            <Link href="/login">
              <a>login now!</a>
            </Link>
          </Form.Item>
        </Card>
      </Col>
    </Row>
  </ErrorBoundary>
)

export default Index
