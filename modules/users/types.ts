import {Person} from "./person"

export type UserDTO = Omit<Person, "password">

export type UserPayload = {
  email: string
  password: string
  firstname: string
  lastname: string
  role?: string
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
