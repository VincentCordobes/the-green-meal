import {Role} from "./user-types"

export type AuthPayload = {
  email: string
  password: string
}

export type AuthResponse = {personId: number; token: string}
export type AuthError = "InvalidCredentials" | "UnvalidatedEmail"

export function getRoles(currentUserRole: Role): Role[] {
  const rolePermissions: Record<Role, Role[]> = {
    regular: ["regular"],
    manager: ["regular", "manager"],
    admin: ["regular", "manager", "admin"],
  }
  return rolePermissions[currentUserRole]
}
