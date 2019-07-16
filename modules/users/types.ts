import {Person} from "./person"

export type UserDTO = Omit<Person, "password" | "emailValidated">

export type UserPayload = {
  email: string
  password: string
  firstname: string
  lastname: string
  role?: string
  managedUserIds?: number[]
}

export type AddUserError = "DuplicateUser"

export type RemoveUserPayload = {userId: number}
export type RemoveUserResponse = {userId: number}

export type UpdateUser = {
  userId: number
  values?: Partial<UserPayload>
}
