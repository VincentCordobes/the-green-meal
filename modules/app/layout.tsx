import React, {FC} from "react"
import Link from "next/link"
import {useRouter, Router} from "next/router"
import message from "antd/lib/message"
import Layout from "antd/lib/layout"
import Menu from "antd/lib/menu"
import Icon from "antd/lib/icon"
import NProgress from "nprogress"

import "antd/dist/antd.css"
import "nprogress/nprogress.css"
import "./style.css"
import "./layout.css"

message.config({
  top: 70,
})

const {Header, Content, Footer} = Layout

NProgress.configure({
  showSpinner: false,
})

Router.events.on("routeChangeStart", () => {
  NProgress.start()
})
Router.events.on("routeChangeComplete", () => NProgress.done())
Router.events.on("routeChangeError", () => NProgress.done())

const AppLayout: FC = props => {
  const router = useRouter()
  console.log(router)
  return (
    <Layout className="layout">
      <Header className="app-header">
        <div className="container">
          <div className="logo">🍒</div>
          <Menu
            theme="light"
            mode="horizontal"
            defaultSelectedKeys={[router.route]}
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
            <Menu.Item style={{top: 0, height: 64}} key="/users">
              <Link href="/users">
                <div>
                  <Icon type="usergroup-delete" />
                  Users
                </div>
              </Link>
            </Menu.Item>
          </Menu>
        </div>
      </Header>
      <Content className="app-content">
        <div className="container">{props.children}</div>
      </Content>
      <Footer className="footer">
        Made with <span id="heart">♥</span> by Vincent Cordobes.
      </Footer>
    </Layout>
  )
}

export default AppLayout
