import {FC} from "react"
import Dropdown from "antd/lib/dropdown"
import Link from "next/link"
import Menu from "antd/lib/menu"
import Icon from "antd/lib/icon"
import Avatar from "antd/lib/avatar"

import {fullName} from "../users/select-user"
import {UserDTO} from "../users/types"

import "./avatar-dropdown.css"

type Props = {
  currentUser?: UserDTO
}
export const AvatarDropDown: FC<Props> = ({currentUser}) => {
  const menu = (
    <Menu>
      <Menu.Item key="settings">
        <Link href="/settings">
          <span>
            <Icon type="setting" /> Settings
          </span>
        </Link>
      </Menu.Item>
      <Menu.Item key="logout">
        <Link href="/logout">
          <span>
            <Icon type="logout" /> Logout
          </span>
        </Link>
      </Menu.Item>
    </Menu>
  )

  return (
    <Dropdown overlay={menu} trigger={["click"]} className="logout-menu">
      <span className="avatar-header">
        <Avatar size="small" />
        {currentUser && (
          <span className="current-user">{fullName(currentUser)}</span>
        )}
      </span>
    </Dropdown>
  )
}
