import {FC} from "react"
import {UserForm} from "./user-form"
import {useCurrentUser} from "../session-context"
import Card from "antd/lib/card"
import {useFetch} from "../use-fetch"
import {UserDTO} from "./types"
import {Row, Col} from "antd"

type Props = {
  user?: UserDTO
}
export const UserSettings: FC<Props> = () => {
  const {currentUser, refresh} = useCurrentUser()

  const {data: users} = useFetch<UserDTO[]>("/api/users", {
    initialData: [],
  })

  return (
    <Row>
      <Col md={{span: 24}} lg={{span: 16, offset: 4}}>
        <Card>
          <h3>Account Settings</h3>
          <UserForm
            onSave={refresh}
            users={users || []}
            user={currentUser}
            withRole
          />
        </Card>
      </Col>
    </Row>
  )
}
