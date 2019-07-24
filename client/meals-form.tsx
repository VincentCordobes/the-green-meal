import React, {useState} from "react"
import moment, {Moment} from "moment"
import Modal from "antd/lib/modal"
import Form from "antd/lib/form"
import DatePicker from "antd/lib/date-picker"
import TimePicker from "antd/lib/time-picker"
import {FormComponentProps} from "antd/lib/form"
import TextArea from "antd/lib/input/TextArea"
import message from "antd/lib/message"

import {
  AddMealRequest,
  MealDTO,
  UpdateMealRequest,
  TIME_FORMAT,
  DATE_FORMAT,
} from "../shared/meals-types"
import {ApiError} from "../shared/api-types"

import {request} from "./http-client"
import {validateCalorieCount, InputCalories} from "./input-calories"

type ModalProps = {
  visible: boolean
  onCancel: () => void
  onSave: (meal: AddMealRequest) => any
  meal?: MealDTO
}

type Props = ModalProps & FormComponentProps<FormValue>

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

function updateMeal(mealId: number, meal: Partial<AddMealRequest>) {
  return request<MealDTO, ApiError, UpdateMealRequest>("/api/meals/edit", {
    method: "POST",
    body: {
      mealId,
      values: meal,
    },
  })
}

function createMeal(meal: AddMealRequest) {
  return request<MealDTO, ApiError, AddMealRequest>("/api/meals/add", {
    method: "POST",
    body: meal,
  })
}

function formatFormValues(values: FormValue): AddMealRequest {
  const {date, time, calories, text} = values

  const meal: AddMealRequest = {
    atTime: moment(time).format(TIME_FORMAT),
    atDate: moment(date).format(DATE_FORMAT),
    calories,
    text,
  }
  moment.ISO_8601

  return meal
}

export const MealForm = Form.create<Props>({
  name: "meal-form",
})((props: Props) => {
  const [loading, setLoading] = useState(false)

  const {getFieldDecorator} = props.form

  const save = () => {
    props.form.validateFields(async (err, values) => {
      if (!err) {
        setLoading(true)

        const meal = formatFormValues(values)

        const response = props.meal
          ? await updateMeal(props.meal.id, meal)
          : await createMeal(meal)

        if (response.ok) {
          await props.onSave(meal)
          message.success("Meal saved")
        } else {
          message.error("An error occurred while serving the meal :(")
        }
        setLoading(false)
      }
    })
  }

  const initialValue = (field: keyof MealDTO) =>
    props.meal ? props.meal[field] : ""

  return (
    <Modal
      keyboard={false}
      visible={props.visible}
      title="Add meal"
      confirmLoading={loading}
      afterClose={props.form.resetFields}
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
            rules: [{required: true, message: "Please enter a text"}],
            initialValue: initialValue("text"),
          })(<TextArea autosize autoFocus placeholder="Banana with apple" />)}
        </Form.Item>
        <Form.Item label="Date">
          {getFieldDecorator("date", {
            rules: [{required: true, message: "Please enter a date"}],
            initialValue: props.meal && moment(props.meal.atDate),
          })(<DatePicker style={{width: "100%"}} />)}
        </Form.Item>
        <Form.Item label="Time">
          {getFieldDecorator("time", {
            rules: [{required: true, message: "Please enter a time"}],
            initialValue: props.meal && moment(props.meal.atTime, TIME_FORMAT),
          })(<TimePicker style={{width: "100%"}} format={TIME_FORMAT} />)}
        </Form.Item>
        <Form.Item label="Calories (kCal)">
          {getFieldDecorator("calories", {
            rules: [
              {required: true, message: "Please enter the calories count"},
              {validator: validateCalorieCount},
            ],
            initialValue: initialValue("calories"),
          })(<InputCalories />)}
        </Form.Item>
        <button hidden />
      </Form>
    </Modal>
  )
})
