import {Person} from "./person"

export type UserDTO = Omit<Person, "password">

export type AddUserPayload = {
  username: string
  password: string
  firstname: string
  lastname: string
  role?: string
}

export type AddUserError = "DuplicateUser"

export type RemoveUserPayload = {userId: number}
export type RemoveUserResponse = {userId: number}
