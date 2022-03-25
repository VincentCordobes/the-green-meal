import {FC} from "react"

import {UserDTO} from "../shared/user_types"

import {UserForm} from "./user_form"
import {useCurrentUser} from "./session_context"
import {useFetch} from "./use_fetch"
import {UserFormLayout} from "./user_form_layout"

export const UserSettings: FC = () => {
  const {currentUser, refresh} = useCurrentUser()

  const {data: users} = useFetch<UserDTO[]>("/api/users", {
    skip: currentUser.role === "regular",
    initialData: [],
  })

  return (
    <UserFormLayout title="Account Settings">
      <UserForm
        onSave={refresh}
        users={users || []}
        user={currentUser}
        currentUser={currentUser}
        withExpectCalories
        withRole
        readOnlyRole
      />
    </UserFormLayout>
  )
}
