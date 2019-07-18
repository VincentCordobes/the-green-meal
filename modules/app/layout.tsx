import React, {FC} from "react"
import {Router} from "next/router"
import message from "antd/lib/message"
import Layout from "antd/lib/layout"
import NProgress from "nprogress"

import "antd/dist/antd.css"
import "nprogress/nprogress.css"
import "./style.css"
import "./layout.css"
import {UserDTO} from "../users/types"
import {CurrentUserProvider} from "../session-context"
import {AppHeader} from "./header"

message.config({
  top: 70,
})

const {Content, Footer} = Layout

NProgress.configure({
  showSpinner: false,
})

Router.events.on("routeChangeStart", () => {
  NProgress.start()
})
Router.events.on("routeChangeComplete", () => NProgress.done())
Router.events.on("routeChangeError", () => NProgress.done())

type Props = {
  currentUser?: UserDTO
}

const AppLayout: FC<Props> = props => {
  return (
    <CurrentUserProvider initialData={props.currentUser}>
      <Layout className="layout">
        <AppHeader />
        <Content className="app-content">
          <div className="container">{props.children}</div>
        </Content>
        <Footer className="footer">
          Made with <span id="heart">♥</span> by Vincent Cordobes.
        </Footer>
      </Layout>
    </CurrentUserProvider>
  )
}

export default AppLayout
