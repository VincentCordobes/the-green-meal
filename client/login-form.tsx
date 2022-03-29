import React, {useState} from "react"
import Checkbox from "antd/lib/checkbox"
import Button from "antd/lib/button"
import Input from "antd/lib/input"
import Form from "antd/lib/form"
import Icon from "antd/lib/icon"
import Card from "antd/lib/card"
import Alert from "antd/lib/alert"
import {FormComponentProps} from "antd/lib/form/Form"
import cookie from "js-cookie"

import {AuthResponse, AuthRequest} from "../shared/auth"
import {request} from "./request"

import {useRouter} from "next/router"
import {pathOr} from "ramda"
import Link from "next/link"
import Popover from "antd/lib/popover"

import styles from "./login-form.module.css"

type Props = FormComponentProps<AuthRequest>

const inlineStyles = {
  loginError: {
    marginBottom: 16,
    width: 300,
  },
}

const LoginForm: React.FC<Props> = (props) => {
  const router = useRouter()

  const [apiError, setApiError] = useState<string | undefined>()
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    props.form.validateFields((err, body) => {
      if (!err) {
        setLoading(true)
        request<AuthResponse>("/api/auth", {method: "POST", body}).then(
          (response) => {
            if (response.ok) {
              cookie.set("token", response.value.token, {expires: 7})
              router.replace("/")
            } else {
              setLoading(false)
              setApiError("Invalid email or password")
            }
          },
        )
      }
    })
  }

  const emailConfirmed = pathOr(false, ["query", "confirmed"], router)
  const pendingEmail = pathOr(false, ["query", "pending"], router)
  const {getFieldDecorator} = props.form

  const errorMessage = apiError || (router.query.error && "Unexpected error")

  return (
    <>
      <Card>
        {errorMessage && (
          <Alert
            message={errorMessage}
            type="error"
            style={inlineStyles.loginError}
          />
        )}
        {emailConfirmed && (
          <Alert
            message="Email successfully confirmed."
            type="info"
            style={inlineStyles.loginError}
          />
        )}
        {/** pendingEmail && (
          <Alert
            message="Please confirm your email address before logging in"
            type="info"
            style={inlineStyles.loginError}
          />
        ) */}
        <Form onSubmit={handleSubmit} className={styles.loginForm}>
          <Form.Item>
            {getFieldDecorator("email", {
              rules: [{required: true, message: "Please enter your email"}],
            })(
              <Input
                prefix={<Icon type="user" style={{color: "rgba(0,0,0,.25)"}} />}
                placeholder="email (admin@meals.com)"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("password", {
              rules: [{required: true, message: "Please input your Password!"}],
            })(
              <Input
                prefix={<Icon type="lock" style={{color: "rgba(0,0,0,.25)"}} />}
                type="password"
                placeholder="Password (meals)"
              />,
            )}
          </Form.Item>

          <Form.Item>
            {getFieldDecorator("remember", {
              valuePropName: "checked",
              initialValue: true,
            })(<Checkbox>Remember me</Checkbox>)}
            <Popover
              trigger="click"
              content="Please contact the admin at admin@meals.com"
            >
              <Button type="link" className={styles.loginFormForgot}>
                Forgot password
              </Button>
            </Popover>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.loginFormButton}
              loading={loading}
            >
              Log in
            </Button>
            Or{" "}
            <Link href="/signup">
              <a>register now!</a>
            </Link>
          </Form.Item>
        </Form>
      </Card>
    </>
  )
}

export default Form.create<Props>({name: "login"})(LoginForm)
