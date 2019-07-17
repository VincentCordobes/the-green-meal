import {FC} from "react"
import {UserForm} from "./user-form"
import {useCurrentUser} from "../session-context"
import Card from "antd/lib/card"

type Props = {}
export const UserSettings: FC<Props> = () => {
  const currentUser = useCurrentUser()
  console.log(currentUser)

  return (
    <Card>
      <h2>Account Settings</h2>
      <UserForm onCancel={() => {}} afterClose={() => {}} visible users={[]} />
    </Card>
  )
}
