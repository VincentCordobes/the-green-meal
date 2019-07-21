export type Role = "regular" | "admin" | "manager"

export type UserDTO = {
  id: number
  email: string
  emailValidated: boolean
  emailValidationToken: string
  managerId: number | null
  role: Role
  firstname: string
  lastname: string
  expectedCaloriesPerDay: number | null
}

export type UserPayload = {
  email: string
  password: string
  firstname: string
  lastname: string
  role?: Role
  managedUserIds?: number[]
  expectedCaloriesPerDay?: number | null
}

export type AddUserError = "DuplicateUser"

export type RemoveUserPayload = {userId: number}
export type RemoveUserResponse = {userId: number}

export type UpdateUser = {
  userId: number
  values?: Partial<UserPayload>
}
