import React, {FC, useEffect, useState} from "react"
import Table, {ColumnProps} from "antd/lib/table"
import Tag from "antd/lib/tag"
import {MealDTO} from "./meals-types"
import {request} from "../http-client"

import "./meals-list.view.css"
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
    render: (at: string) =>
      DateTime.fromISO(at).toLocaleString(DateTime.DATE_SHORT),
  },
  {
    title: "Time",
    key: "time",
    dataIndex: "at",
    render: (at: string) =>
      DateTime.fromISO(at).toLocaleString(DateTime.TIME_SIMPLE),
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

export const MealList: FC = () => {
  const [meals, setMeals] = useState<MealDTO[]>([])
  const [loading, setLoading] = useState(true)

  const {isOpen, openModal, closeModal} = useModal()

  useEffect(() => {
    setLoading(true)
    request<MealDTO[]>("/api/meals").then(response => {
      setLoading(false)
      if (response.ok) {
        setMeals(response.value)
      }
    })
  }, [])
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
          loading={loading}
          rowClassName={() => "meal-item"}
          rowKey="id"
          dataSource={meals}
          columns={columns}
        />
      </Row>
      <MealForm visible={isOpen} onCancel={closeModal} />
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
