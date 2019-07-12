import React from "react"
import Modal from "antd/lib/modal"
import Form from "antd/lib/form"
import Input from "antd/lib/input"
import DatePicker from "antd/lib/date-picker"
import InputNumber from "antd/lib/input-number"
import TimePicker from "antd/lib/time-picker"

import {FormComponentProps} from "antd/lib/form"

import {MealDTO} from "./meals-types"
import TextArea from "antd/lib/input/TextArea"

type ModalProps = {
  visible: boolean
  onCancel: () => void
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

export const MealForm = Form.create<Props>({
  name: "meal-form",
})((props: Props) => {
  const {getFieldDecorator} = props.form

  // const {meal} = props

  const save = () => {}

  return (
    <Modal
      keyboard={false}
      visible={props.visible}
      title="Add meal"
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
          {getFieldDecorator("meal", {
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
