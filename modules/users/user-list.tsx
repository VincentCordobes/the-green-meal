import React, {FC, useState} from "react"
import Table, {ColumnProps} from "antd/lib/table"

import Button from "antd/lib/button"
import Icon from "antd/lib/icon"
import Row from "antd/lib/row"
import {useFetch} from "../use-fetch"

import Divider from "antd/lib/divider"

import "./user-list.css"
import {UserForm} from "./user-form"
import {AddUserPayload, UserDTO} from "./types"
import message from "antd/lib/message"
import {request} from "../http-client"

function buildColumns(params: {
  onDelete: (user: UserDTO) => any
}): ColumnProps<UserDTO>[] {
  return [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
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
      title: "Actions",
      key: "actions",
      align: "center",
      fixed: "right",
      width: 150,
      render: (_, user) => (
        <>
          <Button type="link">
            <Icon type="edit" />
          </Button>
          <Divider type="vertical" />
          <Button type="link" onClick={() => params.onDelete(user)}>
            <Icon type="delete" />
          </Button>
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
  // const [filter, setFilter] = useState<UsersFilter>()
  const {data: users, setData: setUsers, refetch} = useFetch<UserDTO[]>(
    "/api/users",
    {
      // params: filter,
      initialData: props.users,
    },
  )

  const addUser = async (user: AddUserPayload) => {
    const response = await request<UserDTO>("/api/users/add", {
      method: "POST",
      body: user,
    })

    if (response.ok) {
      setUsers(users => (users || []).concat(response.value))
      closeModal()
      message.success("User added")
    }

    return response
  }

  const columns = buildColumns({
    onDelete: async user => {
      await request("/api/users/remove", {
        method: "POST",
        body: {userId: user.id},
      })

      refetch()
      message.success(`User successfully removed`)
    },
  })

  return (
    <>
      <Row type="flex" justify="end" className="table-actions">
        <Button type="primary" onClick={openModal}>
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
      <UserForm onSave={addUser} visible={isOpen} onCancel={closeModal} />
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
