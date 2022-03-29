import "antd/dist/antd.css"
import "nprogress/nprogress.css"
import "../client/style.css"

import type {AppProps} from "next/app"

function MyApp({Component, pageProps}: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
