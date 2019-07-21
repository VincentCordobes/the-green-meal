import {FC} from "react"
import {startsWith} from "ramda"
import {useRouter} from "next/router"
import Link from "next/link"
import Menu from "antd/lib/menu"
import Icon from "antd/lib/icon"
import Layout from "antd/lib/layout"

import {AvatarDropDown} from "./avatar-dropdown"
import {useCurrentUser} from "./session-context"

type Props = {}

const {Header} = Layout

export const AppHeader: FC<Props> = () => {
  const router = useRouter()
  const {currentUser} = useCurrentUser()
  const role = currentUser.role

  return (
    <Header className="app-header">
      <div className="container menu-container">
        <div className="logo">🍒</div>
        <Menu
          theme="light"
          mode="horizontal"
          defaultSelectedKeys={[
            startsWith("/users", router.route) ? "/users" : router.route,
          ]}
          className="app-header-menu"
        >
          <Menu.Item style={{top: 0, height: 64}} key="/">
            <Link href="/">
              <div>
                <Icon type="home" />
                Home
              </div>
            </Link>
          </Menu.Item>
          {["admin", "manager"].includes(role) && (
            <Menu.Item style={{top: 0, height: 64}} key="/users">
              <Link href="/users">
                <div>
                  <Icon type="usergroup-delete" />
                  Users
                </div>
              </Link>
            </Menu.Item>
          )}
        </Menu>
        <AvatarDropDown />
      </div>
    </Header>
  )
}
