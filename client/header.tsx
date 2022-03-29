import {FC} from "react"
import {startsWith} from "ramda"
import {useRouter} from "next/router"
import Link from "next/link"
import Menu from "antd/lib/menu"
import Icon from "antd/lib/icon"
import Layout from "antd/lib/layout"

import {AvatarDropDown} from "./avatar-dropdown"
import {useCurrentUser} from "./session-context"
import styles from "./header.module.css"

type Props = {}

const {Header} = Layout

export const AppHeader: FC<Props> = () => {
  const router = useRouter()
  const {currentUser} = useCurrentUser()
  const role = currentUser.role

  return (
    <Header className={styles.appHeader}>
      <div className={`container ${styles.menuContainer}`}>
        <div className={styles.logo}>🍒</div>
        <Menu
          theme="light"
          mode="horizontal"
          defaultSelectedKeys={[
            startsWith("/users", router.route) ? "/users" : router.route,
          ]}
          className={styles.appHeaderMenu}
        >
          <Menu.Item style={{top: 0, height: 64}} key="/">
            <Link href="/">
              <a>
                <Icon type="home" />
                Home
              </a>
            </Link>
          </Menu.Item>
          {["admin", "manager"].includes(role) && (
            <Menu.Item style={{top: 0, height: 64}} key="/users">
              <Link href="/users">
                <a>
                  <Icon type="usergroup-delete" />
                  Users
                </a>
              </Link>
            </Menu.Item>
          )}
        </Menu>
        <AvatarDropDown />
      </div>
    </Header>
  )
}
