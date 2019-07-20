import React, {useState, useEffect} from "react"
import Form from "antd/lib/form"
import {FormComponentProps} from "antd/lib/form"
import {UserDTO, UserPayload, AddUserError} from "./types"
import Input from "antd/lib/input"
import Select from "antd/lib/select"
import message from "antd/lib/message"
import {request} from "../http-client"
import {propOr} from "ramda"
import {UserSelect, fullName} from "./select-user"
import Button from "antd/lib/button"
import InputNumber from "antd/lib/input-number"

type UserFormProps = {
  onSave?: () => any
  okText?: string
  user?: UserDTO
  users: UserDTO[]
  withRole?: boolean
  readOnlyRole?: boolean
  withPassword?: boolean
  withExpectCalories?: boolean
}

type UserSelectItem = {key: string; label: string}

type FormValues = Omit<UserPayload, "managedUserIds"> & {
  managedUser: UserSelectItem[]
}

type Props = UserFormProps & FormComponentProps<FormValues>

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
  const [managedUsers, setManagedUsers] = useState<UserSelectItem[]>([])
  const clearManagedUsers = () => setManagedUsers([])

  useEffect(() => {
    if (props.user && props.user.role === "manager") {
      request<UserDTO[]>("/api/users/managed", {
        params: {
          managerId: props.user.id,
        },
      }).then(response => {
        if (response.ok) {
          setManagedUsers(
            response.value.map(user => ({
              key: String(user.id),
              label: fullName(user),
            })),
          )
        }
      })
    } else {
      clearManagedUsers()
    }
  }, [props.user])

  const {getFieldDecorator} = props.form

  const save = () => {
    props.form.validateFields(async (err: any, values: FormValues) => {
      if (!err) {
        setLoading(true)

        const {managedUser, ...fields} = values
        const userPayload: UserPayload = managedUser
          ? {
              ...fields,
              managedUserIds: values.managedUser.map(({key}) => Number(key)),
            }
          : fields

        const response = props.user
          ? await updateUser(props.user.id, userPayload)
          : await createUser(userPayload)

        if (props.onSave) {
          await props.onSave()
        }

        if (response.ok) {
          setManagedUsers(managedUser)
          props.form.resetFields()
          message.success(props.user ? "Successfully updated" : "User added")
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

  const users = props.users.filter(
    user => user.id !== (props.user && props.user.id),
  )

  return (
    <Form
      labelCol={{sm: {span: 7}}}
      wrapperCol={{sm: {span: 15}}}
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
      {props.withPassword && (
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
      {props.withExpectCalories && (
        <Form.Item label="Expected kCal/day">
          {getFieldDecorator("expectedCaloriesPerDay", {
            initialValue: initialValue("expectedCaloriesPerDay"),
          })(<InputNumber style={{width: "100%"}} />)}
        </Form.Item>
      )}
      {props.withRole && (
        <Form.Item label="Role">
          {getFieldDecorator("role", {
            initialValue: initialValue("role") || "regular",
          })(
            <Select disabled={props.readOnlyRole}>
              <Option value="regular">Regular</Option>
              <Option value="manager">Manager</Option>
              <Option value="admin">Admin</Option>
            </Select>,
          )}
        </Form.Item>
      )}
      {props.form.getFieldValue("role") === "manager" && (
        <Form.Item label="Managed users">
          {getFieldDecorator("managedUser", {
            initialValue: managedUsers,
          })(<UserSelect users={users} />)}
        </Form.Item>
      )}
      <Form.Item wrapperCol={{sm: {span: 24, offset: 7}}}>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={!props.form.isFieldsTouched()}
        >
          {props.okText || "Save"}
        </Button>
      </Form.Item>
    </Form>
  )
})
