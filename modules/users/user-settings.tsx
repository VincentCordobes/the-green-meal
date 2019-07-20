import {FC} from "react"
import {UserForm} from "./user-form"
import {useCurrentUser} from "../session-context"
import {useFetch} from "../use-fetch"
import {UserDTO} from "./types"
import {UserFormLayout} from "./user-form-layout"

export const UserSettings: FC = () => {
  const {currentUser, refresh} = useCurrentUser()

  const {data: users} = useFetch<UserDTO[]>("/api/users", {
    ignore: currentUser.role === "regular",
    initialData: [],
  })

  return (
    <UserFormLayout title="Account Settings">
      <UserForm
        onSave={refresh}
        users={users || []}
        user={currentUser}
        withExpectCalories
        withRole
        readOnlyRole
      />
    </UserFormLayout>
  )
}
