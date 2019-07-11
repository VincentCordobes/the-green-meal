import React, {useState} from "react"

import Checkbox from "antd/lib/checkbox"
import Button from "antd/lib/button"
import Input from "antd/lib/input"
import Form from "antd/lib/form"
import Icon from "antd/lib/icon"
import message from "antd/lib/message"
import Card from "antd/lib/card"
import Alert from "antd/lib/alert"
import {FormComponentProps} from "antd/lib/form/Form"

import {request} from "../modules/http-client"
import {AuthResponse, AuthPayload} from "../modules/auth-types"

import "./login-form.css"

type Props = FormComponentProps<AuthPayload>

const inlineStyles = {
  loginError: {
    marginBottom: 16,
  },
}

const LoginForm: React.FC<Props> = props => {
  const [apiError, setApiError] = useState<string | undefined>()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    props.form.validateFields((err, body) => {
      if (!err) {
        request<AuthResponse>("/api/auth", {method: "POST", body}).then(
          response => {
            if (response.ok) {
              message.info("UserId: " + response.userId)
            } else {
              setApiError("Invalid username or password")
            }
          },
        )
      }
    })
  }

  const {getFieldDecorator} = props.form

  return (
    <>
      <Card>
        {apiError && (
          <Alert
            message={apiError}
            type="error"
            style={inlineStyles.loginError}
          />
        )}
        <Form onSubmit={handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator("username", {
              rules: [{required: true, message: "Please input your username!"}],
            })(
              <Input
                prefix={<Icon type="user" style={{color: "rgba(0,0,0,.25)"}} />}
                placeholder="Username"
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
                placeholder="Password"
              />,
            )}
          </Form.Item>

          <Form.Item>
            {getFieldDecorator("remember", {
              valuePropName: "checked",
              initialValue: true,
            })(<Checkbox>Remember me</Checkbox>)}
            <a className="login-form-forgot" href="">
              Forgot password
            </a>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
            Or <a href="">register now!</a>
          </Form.Item>
        </Form>
      </Card>
    </>
  )
}

export default Form.create<Props>({name: "login"})(LoginForm)
