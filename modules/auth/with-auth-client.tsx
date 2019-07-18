import React, {Component} from "react"
import Router from "next/router"
import nextCookie from "next-cookies"
import {NextPageContext} from "next"
import {request} from "../http-client"
import {UserDTO} from "../users/types"
import {ApiResponse, OKResponse} from "../api-types"
import nextCookies from "next-cookies"

const getDisplayName = (Component: any) =>
  Component.displayName || Component.name || "Component"

export const withAuth = (WrappedComponent: any) =>
  class extends Component {
    static displayName = `withAuthSync(${getDisplayName(WrappedComponent)})`

    static async getInitialProps(ctx: NextPageContext) {
      const token = auth(ctx)

      const getInitialWrappedComponentProps = WrappedComponent.getInitialProps
        ? WrappedComponent.getInitialProps(ctx, token)
        : Promise.resolve()

      const [componentProps, currentUserResponse] = await Promise.all([
        getInitialWrappedComponentProps,
        // TODO: fetch fullname only if not in localStorage
        // no need to make a request every time ;)
        request<UserDTO>("/api/users/current", {token}),
      ])

      const currentUser = currentUserResponse.ok
        ? currentUserResponse.value
        : undefined

      return {...componentProps, currentUser}
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }

export const auth = (ctx: NextPageContext) => {
  const {token} = nextCookie(ctx)

  if (ctx.req && ctx.res && !token) {
    ctx.res.writeHead(302, {Location: "/login"})
    ctx.res.end()
    return
  }

  // We already checked for server. This should only happen on client.
  if (!token) {
    Router.push("/login")
  }

  return token
}

export async function requestInitialProps<P>(
  ctx: NextPageContext,
  fn: (token: string) => Promise<any>,
  onOk: (response: any) => P,
  onError: () => P,
): Promise<P> {
  const {token} = nextCookies(ctx)

  const redirectOnError = () => {
    if (ctx.res) {
      ctx.res.writeHead(302, {Location: "/login"})
      ctx.res.end()
    } else {
      Router.push("/login")
    }
    return onError()
  }

  if (!token) {
    return redirectOnError()
  }

  const response = await fn(token)
  if (Array.isArray(response)) {
    if (areResponsesOk(response)) {
      return onOk(response.map(response => response.value))
    } else {
      return redirectOnError()
    }
  }

  if (response.ok) {
    return onOk(response.value)
  } else {
    return redirectOnError()
  }
}

function areResponsesOk<T, E = any>(
  responses: ApiResponse<T, E>[],
): responses is OKResponse<T>[] {
  return responses.every(response => response.ok)
}
