import React, {FC} from "react"
import {Router} from "next/router"
import message from "antd/lib/message"
import Layout from "antd/lib/layout"
import NProgress from "nprogress"

import {UserDTO} from "../shared/user_types"
import {CurrentUserProvider} from "./session_context"
import {AppHeader} from "./header"
import styles from "./layout.module.css"

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
  currentUser: UserDTO
}

const AppLayout: FC<Props> = (props) => {
  return (
    <CurrentUserProvider initialData={props.currentUser}>
      <Layout className={styles.layout}>
        <AppHeader />
        <Content className={styles.appContent}>
          <div className="container">{props.children}</div>
        </Content>
        <Footer className={styles.footer}>
          Made with <span className={styles.heart}>♥</span> by Vincent Cordobes.
        </Footer>
      </Layout>
    </CurrentUserProvider>
  )
}

export default AppLayout
