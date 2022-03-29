import Form, {FormComponentProps} from "antd/lib/form"
import {useRouter} from "next/router"
import {usePasswordConfirmation} from "./use-password-confirmation"
import Input from "antd/lib/input"
import Button from "antd/lib/button"
import {useState} from "react"
import {request} from "./request"
import {ResetPasswordRequest, ResetPasswordError} from "../shared/auth"

type FormValues = {
  password: string
}
type Props = FormComponentProps<FormValues>
export const ResetPasswordForm = Form.create<Props>({
  name: "reset-password-form",
})((props: Props) => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const {validateToNextPassword, compareToFirstPassword, handleConfirmBlur} =
    usePasswordConfirmation(props.form)

  const {getFieldDecorator} = props.form

  const save = () => {
    props.form.validateFields(async (err: any, values: FormValues) => {
      if (!err) {
        setLoading(true)

        const response = await request<
          {},
          ResetPasswordError,
          ResetPasswordRequest
        >("/api/auth/reset-password", {
          method: "POST",
          body: {
            token: router.query.token as string,
            newPassword: values.password,
          },
        })

        if (response.ok) {
          router.push("/login")
        } else {
          router.push("/login?error=true")
        }
      }
    })
  }

  return (
    <Form
      labelCol={{md: {span: 8}}}
      wrapperCol={{md: {span: 16}}}
      onSubmit={(e) => {
        e.preventDefault()
        save()
      }}
    >
      <Form.Item label="Password">
        {getFieldDecorator("password", {
          rules: [
            {required: true, message: "Please enter a password"},
            {validator: validateToNextPassword},
          ],
        })(<Input type="password" />)}
      </Form.Item>
      <Form.Item label="Confirm Password" hasFeedback>
        {getFieldDecorator("confirm", {
          rules: [
            {required: true, message: "Please confirm your password!"},
            {validator: compareToFirstPassword},
          ],
        })(<Input.Password onBlur={handleConfirmBlur} />)}
      </Form.Item>
      <Form.Item wrapperCol={{md: {span: 16, offset: 8}}}>
        <Button
          type="primary"
          loading={loading}
          htmlType="submit"
          disabled={!props.form.isFieldsTouched()}
        >
          Save
        </Button>
      </Form.Item>
    </Form>
  )
})
