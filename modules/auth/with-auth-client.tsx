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

export type AuthProps = {
  currentUser: UserDTO
}

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
        request<UserDTO>("/api/users/current", {token}),
      ])

      if (!currentUserResponse.ok) {
        return redirectToLogin(ctx)
      }

      return {...componentProps, currentUser: currentUserResponse.value}
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }

const redirectToLogin = (ctx: NextPageContext) => {
  if (ctx.res) {
    ctx.res.writeHead(302, {Location: "/login"})
    ctx.res.end()
  } else {
    Router.push("/login")
  }
}

export const auth = (ctx: NextPageContext) => {
  const {token} = nextCookie(ctx)

  if (!token) {
    redirectToLogin(ctx)
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
