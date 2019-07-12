import React, {FC} from "react"
import message from "antd/lib/message"
import Layout from "antd/lib/layout"
import Menu from "antd/lib/menu"
import Icon from "antd/lib/icon"

import "antd/dist/antd.css"
import "./style.css"
import "./layout.css"

message.config({
  top: 70,
})

const {Header, Content, Footer} = Layout

const AppLayout: FC = props => (
  <Layout className="layout">
    <Header className="app-header">
      <div className="container">
        <div className="logo">🍒</div>
        <Menu
          theme="light"
          mode="horizontal"
          defaultSelectedKeys={["my-library"]}
          className="app-header-menu"
        >
          <Menu.Item style={{top: 0, height: 64}} key="my-library">
            <Icon type="home" />
            Home
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

export default AppLayout
