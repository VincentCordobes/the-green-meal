import {Role} from "./user-types"

export type AuthRequest = {
  email: string
  password: string
}

export type AuthResponse = {personId: number; token: string}

export type AuthError = "InvalidCredentials" | "UnvalidatedEmail"

export type ForgotPasswordRequest = {email: string}

export type ResetPasswordRequest = {
  token: string
  newPassword: string
}

export type ResetPasswordError = "InvalidLink"

export function getRoles(currentUserRole: Role): Role[] {
  const rolePermissions: Record<Role, Role[]> = {
    regular: ["regular"],
    manager: ["regular", "manager"],
    admin: ["regular", "manager", "admin"],
  }
  return rolePermissions[currentUserRole]
}
