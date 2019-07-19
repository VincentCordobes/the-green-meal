import {FC} from "react"
import Dropdown from "antd/lib/dropdown"
import Link from "next/link"
import Menu from "antd/lib/menu"
import Icon from "antd/lib/icon"
import Avatar from "antd/lib/avatar"

import {fullName} from "../users/select-user"

import "./avatar-dropdown.css"
import {useCurrentUser} from "../session-context"

type Props = {}
export const AvatarDropDown: FC<Props> = () => {
  const {currentUser} = useCurrentUser()
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
        <span className="current-user">{fullName(currentUser)}</span>
      </span>
    </Dropdown>
  )
}
