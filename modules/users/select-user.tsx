import React, {FC, useState, useRef} from "react"
import {Select, Spin} from "antd"
import {UserDTO} from "./types"
import {SelectProps} from "antd/lib/select"

const {Option} = Select

export const fullName = (user: UserDTO) => user.firstname + " " + user.lastname

type Props = {
  users: UserDTO[]
} & SelectProps
export const UserSelect: FC<Props> = React.forwardRef(
  (props: Props, ref: any) => {
    const {users} = props
    const [searchText, setSearchText] = useState("")

    const filteredUsers = users.filter(
      user => fullName(user).indexOf(searchText) !== -1,
    )

    return (
      <Select
        ref={ref}
        mode="multiple"
        labelInValue
        placeholder="Select users"
        filterOption={false}
        onSearch={setSearchText}
        onSelect={() => setSearchText("")}
        style={{width: "100%"}}
        {...props}
      >
        {filteredUsers.map(user => (
          <Option key={user.id}>{fullName(user)}</Option>
        ))}
      </Select>
    )
  },
)
