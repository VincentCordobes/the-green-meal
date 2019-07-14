import React, {useState} from "react"
import Modal from "antd/lib/modal"
import Form from "antd/lib/form"
import {FormComponentProps} from "antd/lib/form"
import {AddUserPayload, UserDTO, AddUserError} from "./types"
import Input from "antd/lib/input"
import Select from "antd/lib/select"
import {ApiResponse} from "../api-types"

type ModalProps = {
  visible: boolean
  onCancel: () => void
  onSave: (user: AddUserPayload) => Promise<ApiResponse<UserDTO, AddUserError>>
  // user: UserDTO
}

type Props = ModalProps & FormComponentProps<AddUserPayload>

const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 12,
  },
}

const {Option} = Select

export const UserForm = Form.create<Props>({
  name: "user-form",
})((props: Props) => {
  const [loading, setLoading] = useState(false)

  const {getFieldDecorator} = props.form

  const save = () => {
    props.form.validateFields(async (err, values) => {
      if (!err) {
        setLoading(true)

        const response = await props.onSave(values)
        if (response.ok) {
          props.form.resetFields()
        } else if (response.error === "DuplicateUser") {
          props.form.setFields({
            username: {
              value: values.username,
              errors: [new Error("This username already exists")],
            },
          })
        }

        setLoading(false)
      }
    })
  }

  return (
    <Modal
      keyboard={false}
      visible={props.visible}
      title="Add user"
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
        <Form.Item label="Username">
          {getFieldDecorator("username", {
            rules: [{required: true, message: "Please enter a username"}],
            // initialValue: user.text,
          })(<Input autoFocus />)}
        </Form.Item>
        <Form.Item label="Password">
          {getFieldDecorator("password", {
            rules: [{required: true, message: "Please enter a password"}],
            // initialValue: user.date,
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Firstname">
          {getFieldDecorator("firstname", {
            rules: [{required: true, message: "Please enter a firstname"}],
            // initialValue: user.time,
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Lastname">
          {getFieldDecorator("lastname", {
            rules: [{required: true, message: "Please enter a lastname"}],
            // initialValue: user.time,
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Role">
          {getFieldDecorator("role", {
            rules: [{required: true, message: "Please enter role"}],
            initialValue: "regular",
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
