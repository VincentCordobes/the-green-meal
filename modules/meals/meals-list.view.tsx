import React, {FC, useState} from "react"
import Table, {ColumnProps} from "antd/lib/table"
import Tag from "antd/lib/tag"
import {MealDTO, AddMealDTO, MealsFilter} from "./meals-types"
import {request} from "../http-client"

import "./meals-list.view.css"
import message from "antd/lib/message"
import Button from "antd/lib/button"
import Icon from "antd/lib/icon"
import Row from "antd/lib/row"
import DatePicker from "antd/lib/date-picker"
import {MealForm} from "./meal-form.view"
import {DateTime} from "luxon"
import moment from "moment"
import {useFetch} from "../use-fetch"
import TimePicker from "antd/lib/time-picker"
import Divider from "antd/lib/divider"
import {dissoc} from "ramda"

const {RangePicker} = DatePicker

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
    render: (at: string) => DateTime.fromISO(at).toFormat("HH:mm"),
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
  const [filter, setFilter] = useState<MealsFilter>()
  const {data: meals, setData: setMeals} = useFetch<MealDTO[]>("/api/meals", {
    params: filter,
    initialData: props.meals,
  })

  const addMeal = async (meal: AddMealDTO) => {
    const response = await request<MealDTO>("/api/meals/add", {
      method: "POST",
      body: meal,
    })

    if (response.ok) {
      setMeals(meals => (meals || []).concat(response.value))
      message.success("Meal added")
    } else {
      message.error("Could not add the meal :(")
    }

    closeModal()
  }

  const PICKER_FORMAT = "MM-DD-YYYY"

  return (
    <>
      <Row type="flex" justify="space-between" className="table-actions">
        <div>
          <RangePicker
            format={PICKER_FORMAT}
            onChange={(_, [start, end]) => {
              let filterValue: MealsFilter = {}
              const formatDate = (date: string) =>
                moment(date, PICKER_FORMAT).format("YYYY-MM-DD")

              if (start) {
                filterValue.fromDate = formatDate(start)
              }
              if (end) {
                filterValue.toDate = formatDate(end)
              }

              setFilter(filterValue)
            }}
          />
          <Divider type="vertical" />
          <TimePicker
            format="HH:mm"
            placeholder="From time"
            className="date-picker"
            onChange={(_, fromTime) => {
              if (fromTime) {
                setFilter({fromTime})
              } else {
                setFilter(dissoc("fromTime"))
              }
            }}
          />
          <TimePicker
            format="HH:mm"
            placeholder="To time"
            onChange={(_, toTime) => {
              if (toTime) {
                setFilter({toTime})
              } else {
                setFilter(dissoc("toTime"))
              }
            }}
          />
        </div>
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
