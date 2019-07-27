import React, {FC} from "react"
import Table, {ColumnProps} from "antd/lib/table"
import Button from "antd/lib/button"
import Icon from "antd/lib/icon"
import Row from "antd/lib/row"
import message from "antd/lib/message"
import Tooltip from "antd/lib/tooltip"
import Popconfirm from "antd/lib/popconfirm"
import Divider from "antd/lib/divider"
import Tag from "antd/lib/tag"
import Link from "next/link"

import {UserDTO} from "../shared/user-types"
import {useFetch} from "./use-fetch"
import {request} from "./request"
import "./user-list.css"

function buildColumns(params: {
  onDelete: (user: UserDTO) => any
}): ColumnProps<UserDTO>[] {
  return [
    {
      title: "email",
      dataIndex: "email",
      key: "email",
      // sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Firstname",
      key: "firstname",
      dataIndex: "firstname",
      // sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Lastname",
      key: "lastname",
      dataIndex: "lastname",
    },
    {
      title: "Role",
      key: "role",
      render: ({role, emailValidated}: UserDTO) => {
        if (!emailValidated) {
          return <Tag color="orange">pending</Tag>
        }
        if (role === "admin") {
          return <Tag color="red">Admin</Tag>
        }

        if (role === "manager") {
          return <Tag color="blue">Manager</Tag>
        }
        return ""
      },
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      fixed: "right",
      width: 150,
      render: (_, user) => (
        <>
          <Link href="/users/edit/[userId]" as={`/users/edit/${user.id}`}>
            <Button type="link" size="small">
              <Tooltip title="Edit" placement="bottom">
                <Icon type="edit" />
              </Tooltip>
            </Button>
          </Link>
          <Divider type="vertical" />
          <Popconfirm
            title="Are you sure you want to delete this user ?"
            onConfirm={() => params.onDelete(user)}
          >
            <Tooltip title="Delete" placement="bottom">
              <Button type="link" size="small">
                <Icon type="delete" />
              </Button>
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
  const {data: users, refetch} = useFetch<UserDTO[]>("/api/users", {
    initialData: props.users,
  })

  const columns = buildColumns({
    onDelete: async user => {
      await request("/api/users/remove", {
        method: "POST",
        body: {userId: user.id},
      })

      await refetch()
      message.success(`User successfully removed`)
    },
  })

  return (
    <>
      <Row type="flex" justify="end" className="table-actions">
        <Link href="/users/add">
          <Button type="primary">
            <Icon type="plus" />
            Add user
          </Button>
        </Link>
      </Row>
      <Row>
        <Table
          rowClassName={() => "user-item"}
          rowKey="id"
          dataSource={users}
          columns={columns}
        />
      </Row>
    </>
  )
}
