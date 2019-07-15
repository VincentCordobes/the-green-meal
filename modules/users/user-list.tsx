import React, {FC, useState, useCallback} from "react"
import Table, {ColumnProps} from "antd/lib/table"
import Button from "antd/lib/button"
import Icon from "antd/lib/icon"
import Row from "antd/lib/row"
import message from "antd/lib/message"
import Tooltip from "antd/lib/tooltip"
import Popconfirm from "antd/lib/popconfirm"
import Divider from "antd/lib/divider"

import {useFetch} from "../use-fetch"
import {request} from "../http-client"

import {UserDTO} from "./types"
import {UserForm} from "./user-form"

import "./user-list.css"
import Tag from "antd/lib/tag"

function buildColumns(params: {
  onDelete: (user: UserDTO) => any
  onEdit: (user: UserDTO) => any
}): ColumnProps<UserDTO>[] {
  return [
    {
      title: "email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Firstname",
      key: "firstname",
      dataIndex: "firstname",
    },
    {
      title: "Lastname",
      key: "lastname",
      dataIndex: "lastname",
    },
    {
      title: "Role",
      key: "role",
      dataIndex: "role",
    },
    {
      title: "Status",
      key: "emailValidated",
      dataIndex: "emailValidated",
      render: validated => (validated ? "" : <Tag color="orange">pending</Tag>),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      fixed: "right",
      width: 150,
      render: (_, user) => (
        <>
          <Tooltip title="Edit" placement="bottom">
            <Button type="link" onClick={() => params.onEdit(user)}>
              <Icon type="edit" />
            </Button>
          </Tooltip>
          <Divider type="vertical" />
          <Popconfirm
            title="Are you sure you want to delete this user ?"
            onConfirm={() => params.onDelete(user)}
          >
            <Tooltip title="Delete" placement="bottom">
              <a>
                <Icon type="delete" />
              </a>
            </Tooltip>
          </Popconfirm>
        </>
      ),
    },
  ]
}

type Props = {
  users: UserDTO[]
}

export const UserList: FC<Props> = props => {
  const {isOpen, openModal, closeModal} = useModal()

  const [selectedUser, setSelectedUser] = useState<UserDTO>()

  const resetSelectedUser = useCallback(() => setSelectedUser(undefined), [])

  const {data: users, refetch} = useFetch<UserDTO[]>("/api/users", {
    initialData: props.users,
  })

  const columns = buildColumns({
    onDelete: async user => {
      await request("/api/users/remove", {
        method: "POST",
        body: {userId: user.id},
      })

      refetch()
      resetSelectedUser()
      message.success(`User successfully removed`)
    },
    onEdit: user => {
      setSelectedUser(user)
      openModal()
    },
  })

  const handleSave = useCallback(async () => {
    await refetch()
    closeModal()
  }, [closeModal, refetch])

  return (
    <>
      <Row type="flex" justify="end" className="table-actions">
        <Button
          type="primary"
          onClick={() => {
            resetSelectedUser()
            openModal()
          }}
        >
          <Icon type="plus" />
          Add user
        </Button>
      </Row>
      <Row>
        <Table
          rowClassName={() => "user-item"}
          rowKey="id"
          dataSource={users}
          columns={columns}
        />
      </Row>
      <UserForm
        visible={isOpen}
        onSave={handleSave}
        onCancel={closeModal}
        afterClose={resetSelectedUser}
        user={selectedUser}
      />
    </>
  )
}

const useModal = () => {
  const [isOpen, setVisible] = useState(false)

  return {
    isOpen,
    openModal() {
      setVisible(true)
    },
    closeModal() {
      setVisible(false)
    },
  }
}
