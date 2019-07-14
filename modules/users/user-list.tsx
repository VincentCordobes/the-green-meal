import React, {FC, useState} from "react"
import Table, {ColumnProps} from "antd/lib/table"

import Button from "antd/lib/button"
import Icon from "antd/lib/icon"
import Row from "antd/lib/row"
import {useFetch} from "../use-fetch"
import {UserDTO} from "./users"

import Divider from "antd/lib/divider"

import "./user-list.css"

const columns: ColumnProps<UserDTO>[] = [
  {
    title: "Username",
    dataIndex: "username",
    key: "username",
  },
  {
    title: "Role",
    key: "role",
    dataIndex: "role",
    // render: (at: string) => DateTime.fromISO(at).toFormat("MM-dd-yyyy"),
  },
  {
    title: "Lastname",
    key: "lastname",
    dataIndex: "lastname",
    // render: (at: string) => DateTime.fromISO(at).toFormat("HH:mm"),
  },
  {
    title: "Actions",
    key: "actions",
    align: "center",
    fixed: "right",
    width: 150,
    render: () => (
      <>
        <Button type="link">
          <Icon type="edit" />
        </Button>
        <Divider type="vertical" />
        <Button type="link">
          <Icon type="delete" />
        </Button>
      </>
    ),
  },
]

type Props = {
  users: UserDTO[]
}

export const UserList: FC<Props> = props => {
  const {isOpen, openModal, closeModal} = useModal()
  // const [filter, setFilter] = useState<UsersFilter>()
  const {data: users, setData: setUsers} = useFetch<UserDTO[]>("/api/users", {
    // params: filter,
    initialData: props.users,
  })

  // const addUser = async (user: AddUserDTO) => {
  //   const response = await request<UserDTO>("/api/users/add", {
  //     method: "POST",
  //     body: user,
  //   })
  //
  //   if (response.ok) {
  //     setUsers(users => (users || []).concat(response.value))
  //     message.success("User added")
  //   } else {
  //     message.error("Could not add the user :(")
  //   }
  //
  //   closeModal()
  // }

  const PICKER_FORMAT = "MM-DD-YYYY"

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
      {/* <UserForm onSave={addUser} visible={isOpen} onCancel={closeModal} /> */}
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
