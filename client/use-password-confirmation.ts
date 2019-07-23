import {useState} from "react"
import {WrappedFormUtils} from "antd/lib/form/Form"

export function usePasswordConfirmation<T>(form: WrappedFormUtils<T>) {
  const [confirmDirty, setConfirmDirty] = useState(false)

  const handleConfirmBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const {value} = e.target
    setConfirmDirty(confirmDirty || !!value)
  }

  const compareToFirstPassword = (
    _: any,
    value: string | undefined,
    callback: any,
  ) => {
    if (value && value !== form.getFieldValue("password")) {
      callback("The password confirmation does not match")
    } else {
      callback()
    }
  }

  const validateToNextPassword = (
    _: any,
    value: string | undefined,
    callback: any,
  ) => {
    if (value && confirmDirty) {
      form.validateFields(["confirm"], {force: true})
    }
    callback()
  }

  return {
    handleConfirmBlur,
    compareToFirstPassword,
    validateToNextPassword,
  }
}
