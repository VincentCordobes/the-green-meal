import React, {useState} from "react"
import moment, {Moment} from "moment"
import Modal from "antd/lib/modal"
import Form from "antd/lib/form"
import DatePicker from "antd/lib/date-picker"
import InputNumber from "antd/lib/input-number"
import TimePicker from "antd/lib/time-picker"
import {FormComponentProps} from "antd/lib/form"
import TextArea from "antd/lib/input/TextArea"

import {MealDTO, AddMealDTO} from "./meals-types"

type ModalProps = {
  visible: boolean
  onCancel: () => void
  onSave: (meal: AddMealDTO) => Promise<void>
  // meal: MealDTO
}

type Props = ModalProps & FormComponentProps<Omit<MealDTO, "id">>

const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 12,
  },
}

type FormValue = {
  text: string
  date: Moment
  time: Moment
  calories: number
}
export const MealForm = Form.create<Props>({
  name: "meal-form",
})((props: Props) => {
  const [loading, setLoading] = useState(false)

  const {getFieldDecorator, getFieldsValue} = props.form

  const save = async () => {
    setLoading(true)
    const {date, time, calories, text} = getFieldsValue() as FormValue
    const at = moment(date).set({
      hour: time.get("hour"),
      minute: time.get("minute"),
      second: time.get("second"),
    })

    const meal: AddMealDTO = {
      at: at.toISOString(),
      calories,
      text,
    }

    await props.onSave(meal)

    props.form.resetFields()
    setLoading(false)
  }

  return (
    <Modal
      keyboard={false}
      visible={props.visible}
      title="Add meal"
      confirmLoading={loading}
      onOk={save}
      onCancel={props.onCancel}
    >
      <Form
        {...formItemLayout}
        onSubmit={e => {
          e.preventDefault()
          save()
        }}
      >
        <Form.Item label="Meal">
          {getFieldDecorator("text", {
            // initialValue: meal.text,
          })(<TextArea autosize autoFocus placeholder="Banana with apple" />)}
        </Form.Item>
        <Form.Item label="Date">
          {getFieldDecorator("date", {
            // initialValue: meal.date,
          })(<DatePicker style={{width: "100%"}} />)}
        </Form.Item>
        <Form.Item label="Time">
          {getFieldDecorator("time", {
            // initialValue: meal.time,
          })(<TimePicker style={{width: "100%"}} />)}
        </Form.Item>
        <Form.Item label="Calories (kCal)">
          {getFieldDecorator("calories", {
            // initialValue: meal.calories,
          })(<InputNumber style={{width: "100%"}} />)}
        </Form.Item>
        <button hidden />
      </Form>
    </Modal>
  )
})
