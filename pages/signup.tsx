import {NextPage} from "next"
import React from "react"
import Row from "antd/lib/row"
import Col from "antd/lib/col"
import Card from "antd/lib/card"
import Form from "antd/lib/form"
import Router from "next/router"
import Link from "next/link"

import {ErrorBoundary} from "../client/error_boundary"
import {UserForm} from "../client/user_form"

import styles from "./signup.module.css"

type Props = {}

const Index: NextPage<Props> = () => (
  <ErrorBoundary>
    <Row className={styles.signupContainer}>
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
            withPassword
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
