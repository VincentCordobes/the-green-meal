import React, {FC, useState} from "react"
import Table, {ColumnProps} from "antd/lib/table"
import Tag from "antd/lib/tag"
import {MealDTO, AddMealDTO} from "./meals-types"
import {request} from "../http-client"

import "./meals-list.view.css"
import message from "antd/lib/message"
import Button from "antd/lib/button"
import Icon from "antd/lib/icon"
import Row from "antd/lib/row"
import {MealForm} from "./meal-form.view"
import {DateTime} from "luxon"

const columns: ColumnProps<MealDTO>[] = [
  {
    title: "Meal",
    dataIndex: "text",
    key: "text",
  },
  {
    title: "Date",
    key: "date",
    dataIndex: "at",
    render: (at: string) => DateTime.fromISO(at).toFormat("MM-dd-yyyy"),
  },
  {
    title: "Time",
    key: "time",
    dataIndex: "at",
    render: (at: string) => DateTime.fromISO(at).toFormat("HH:mm a"),
  },
  {
    title: "Calories",
    dataIndex: "calories",
    key: "calories",
    render: (calories: number) => (
      <Tag color={calories > 400 ? "#f5222d" : "#7cb305"}>
        <span className="meal-calories">{calories} kCal</span>
      </Tag>
    ),
  },
]

type Props = {
  meals: MealDTO[]
}

export const MealList: FC<Props> = props => {
  const {isOpen, openModal, closeModal} = useModal()
  const [meals, setMeals] = useState(props.meals)

  const addMeal = async (meal: AddMealDTO) => {
    const response = await request<MealDTO>("/api/meals/add", {
      method: "POST",
      body: meal,
    })

    if (response.ok) {
      setMeals(meals => meals.concat(response.value))
      message.success("Meal added")
    } else {
      message.error("Could not add the meal :(")
    }

    closeModal()
  }

  return (
    <>
      <Row type="flex" justify="end" className="table-actions">
        <Button type="primary" onClick={openModal}>
          <Icon type="plus" />
          Add meal
        </Button>
      </Row>
      <Row>
        <Table
          rowClassName={() => "meal-item"}
          rowKey="id"
          dataSource={meals}
          columns={columns}
        />
      </Row>
      <MealForm onSave={addMeal} visible={isOpen} onCancel={closeModal} />
    </>
  )
}

const useModal = () => {
  const [isOpen, setVisible] = useState(false)

  return {
    isOpen,
    openModal() {
      setVisible(true)
    },
    closeModal() {
      setVisible(false)
    },
  }
}
