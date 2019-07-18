import React, {FC} from "react"
import Modal from "antd/lib/modal"
import {UserForm} from "./user-form"
import {UserDTO} from "./types"

type Props = {
  visible: boolean
  user?: UserDTO
}
export const UserFormModal: FC<Props> = props => {
  return null
}
/**
    <Modal
      keyboard={true}
      visible={props.visible}
      title={props.user ? "Edit user" : "Add user"}
      afterClose={() => {
        props.form.resetFields()
        clearManagedUsers()
        props.afterClose()
      }}
      confirmLoading={loading}
      onOk={save}
      width={600}
      onCancel={props.onCancel}
    >
      <UserFom />

    </Modal>
  ) */
