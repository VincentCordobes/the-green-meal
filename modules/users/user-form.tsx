import React, {useState} from "react"
import Modal from "antd/lib/modal"
import Form from "antd/lib/form"
import {FormComponentProps} from "antd/lib/form"
import {UserDTO, UserPayload, AddUserError} from "./types"
import Input from "antd/lib/input"
import Select from "antd/lib/select"
import message from "antd/lib/message"
import {request} from "../http-client"
import {propOr} from "ramda"

type UserFormProps = {
  visible: boolean
  onSave: () => Promise<void>
  onCancel: () => void
  afterClose: () => void
  user?: UserDTO
}

type Props = UserFormProps & FormComponentProps<UserPayload>

const formItemLayout = {
  labelCol: {span: 8},
  wrapperCol: {span: 12},
}

function updateUser(userId: number, values: UserPayload) {
  return request<UserDTO, AddUserError>("/api/users/update", {
    method: "POST",
    body: {
      userId,
      values,
    },
  })
}

function createUser(values: UserPayload) {
  return request<UserDTO, AddUserError>("/api/users/add", {
    method: "POST",
    body: values,
  })
}

export const UserForm = Form.create<Props>({
  name: "user-form",
})((props: Props) => {
  const [loading, setLoading] = useState(false)

  const {getFieldDecorator} = props.form

  const save = () => {
    props.form.validateFields(async (err: any, values: UserPayload) => {
      if (!err) {
        setLoading(true)

        const response = props.user
          ? await updateUser(props.user.id, values)
          : await createUser(values)

        await props.onSave()

        if (response.ok) {
          props.form.resetFields()
          message.success("User added")
        } else if (response.error === "DuplicateUser") {
          props.form.setFields({
            email: {
              value: propOr("", "email", values),
              errors: [new Error("This email already exists")],
            },
          })
        } else {
          message.error("Oops something went wrong :(")
        }

        setLoading(false)
      }
    })
  }

  const initialValue = (field: keyof UserDTO) =>
    props.user ? props.user[field] : ""

  const {Option} = Select

  return (
    <Modal
      keyboard={true}
      visible={props.visible}
      title={props.user ? "Edit user" : "Add user"}
      afterClose={props.afterClose}
      confirmLoading={loading}
      onOk={save}
      onCancel={props.onCancel}
    >
      <Form
        {...formItemLayout}
        onSubmit={e => {
          e.preventDefault()
          save()
        }}
      >
        <Form.Item label="email">
          {getFieldDecorator("email", {
            rules: [
              {required: true, message: "Please enter a email"},
              {type: "email", message: "Please enter a valid email"},
            ],
            initialValue: initialValue("email"),
          })(<Input autoFocus />)}
        </Form.Item>
        {!props.user && (
          <Form.Item label="Password">
            {getFieldDecorator("password", {
              rules: [{required: true, message: "Please enter a password"}],
            })(<Input type="password" />)}
          </Form.Item>
        )}
        <Form.Item label="Firstname">
          {getFieldDecorator("firstname", {
            rules: [{required: true, message: "Please enter a firstname"}],
            initialValue: initialValue("firstname"),
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Lastname">
          {getFieldDecorator("lastname", {
            rules: [{required: true, message: "Please enter a lastname"}],
            initialValue: initialValue("lastname"),
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Role">
          {getFieldDecorator("role", {
            rules: [{required: true, message: "Please enter role"}],
            initialValue: initialValue("role") || "regular",
          })(
            <Select>
              <Option value="regular">Regular</Option>
              <Option value="manager">Manager</Option>
              <Option value="admin">Admin</Option>
            </Select>,
          )}
        </Form.Item>
        <button hidden />
      </Form>
    </Modal>
  )
})
