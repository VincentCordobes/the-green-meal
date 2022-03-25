import {FC} from "react"
import Dropdown from "antd/lib/dropdown"
import Link from "next/link"
import Menu from "antd/lib/menu"
import Icon from "antd/lib/icon"
import Avatar from "antd/lib/avatar"

import {fullName} from "./user_select"
import {useCurrentUser} from "./session_context"

import styles from "./avatar_dropdown.module.css"

type Props = {}
export const AvatarDropDown: FC<Props> = () => {
  const {currentUser} = useCurrentUser()
  const menu = (
    <Menu>
      <Menu.Item key="settings">
        <Link href="/settings">
          <a>
            <Icon type="setting" /> Settings
          </a>
        </Link>
      </Menu.Item>
      <Menu.Item key="logout">
        <Link href="/logout">
          <a>
            <Icon type="logout" /> Logout
          </a>
        </Link>
      </Menu.Item>
    </Menu>
  )

  return (
    <Dropdown overlay={menu} trigger={["click"]} className={styles.logoutMenu}>
      <span className={styles.avatarHeader}>
        <Avatar size="small" />
        <span className={styles.currentUser}>{fullName(currentUser)}</span>
      </span>
    </Dropdown>
  )
}
