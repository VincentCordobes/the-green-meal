import React, {FC, useState} from "react"
import Table, {ColumnProps} from "antd/lib/table"
import TimePicker from "antd/lib/time-picker"
import Divider from "antd/lib/divider"
import {dissoc, omit} from "ramda"
import Tooltip from "antd/lib/tooltip"
import moment from "moment"
import Popconfirm from "antd/lib/popconfirm"
import message from "antd/lib/message"
import Button from "antd/lib/button"
import Icon from "antd/lib/icon"
import Row from "antd/lib/row"
import DatePicker from "antd/lib/date-picker"
import Tag from "antd/lib/tag"
import {Col} from "antd"

import {
  MealDTO,
  MealsFilter,
  MealListResponse,
  MealItem,
  DATE_FORMAT,
} from "../shared/meals_types"
import {UserDTO} from "../shared/user_types"

import {request} from "./request"
import {MealForm} from "./meals_form"
import {useFetch} from "./use_fetch"
import {useCurrentUser} from "./session_context"

import styles from "./meals_list.module.css"

const {RangePicker} = DatePicker

function buildColumns(
  user: UserDTO,
  params: {
    onDelete: (meal: MealDTO) => any
    onEdit: (meal: MealDTO) => any
  },
): ColumnProps<MealDTO>[] {
  const displayUserCol = user.role === "admin"
  const userCol = [
    {
      title: "User",
      dataIndex: "fullname",
      key: "fullname",
    },
  ]

  return [
    ...(displayUserCol ? userCol : []),
    {
      title: "Meal",
      dataIndex: "text",
      key: "text",
    },
    {
      title: "Date",
      key: "date",
      dataIndex: "atDate",
      render: (atDate: string) => moment(atDate).format("MM-DD-YYYY"),
    },
    {
      title: "Time",
      key: "time",
      dataIndex: "atTime",
    },
    {
      title: "Calories",
      key: "calories",
      render: ({calories, expectedCaloriesPerDay}: MealItem) => {
        let color
        if (expectedCaloriesPerDay) {
          if (expectedCaloriesPerDay < calories) {
            color = "#f5222d"
          } else {
            color = "#7cb305"
          }
        }
        return (
          <Tag color={color}>
            <span className={styles.mealCalories}>{calories} kCal</span>
          </Tag>
        )
      },
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      fixed: "right",
      width: 150,
      render: (_, user) => (
        <>
          <Tooltip title="Edit" placement="bottom">
            <Button
              type="link"
              size="small"
              onClick={() => params.onEdit(user)}
            >
              <Icon type="edit" />
            </Button>
          </Tooltip>
          <Divider type="vertical" />
          <Popconfirm
            title="Are you sure you want to delete this meal?"
            onConfirm={() => params.onDelete(user)}
          >
            <Tooltip title="Delete" placement="bottom">
              <Button type="link" size="small">
                <Icon type="delete" />
              </Button>
            </Tooltip>
          </Popconfirm>
        </>
      ),
    },
  ]
}

type Props = {
  meals: MealListResponse
}

export const MealList: FC<Props> = (props) => {
  const {isOpen, openModal, closeModal} = useModal()
  const [filter, setFilter] = useState<MealsFilter>()
  const [selectedMeal, setSelectedMeal] = useState<MealDTO>()
  const {data: meals, refetch} = useFetch("/api/meals", {
    params: filter,
    initialData: props.meals,
  })

  const {currentUser} = useCurrentUser()

  const onSave = async () => {
    await refetch()
    closeModal()
  }

  const columns = buildColumns(currentUser, {
    onDelete: async (meal) => {
      await request("/api/meals/remove", {
        method: "POST",
        body: {mealId: meal.id},
      })

      await refetch()
      message.success(`Meal successfully removed`)
    },
    onEdit: (meal) => {
      setSelectedMeal(meal)
      openModal()
    },
  })

  const PICKER_FORMAT = "MM-DD-YYYY"

  return (
    <>
      <Row type="flex" justify="space-between" className={styles.tableActions}>
        <Col className={styles.mealsFilters}>
          <RangePicker
            format={PICKER_FORMAT}
            onChange={(_, [start, end]) => {
              let filterValue: MealsFilter = omit(
                ["fromDate", "toDate"],
                filter,
              )
              const formatDate = (date: string) =>
                moment(date, PICKER_FORMAT).format(DATE_FORMAT)

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
          <div className={styles.timePickers}>
            <TimePicker
              format="HH:mm"
              placeholder="From time"
              className={styles.datePicker}
              onChange={(_, fromTime) => {
                if (fromTime) {
                  setFilter({...filter, fromTime})
                } else {
                  const newFilter: MealsFilter = dissoc("fromTime", filter!)
                  setFilter(newFilter)
                }
              }}
            />
            <TimePicker
              format="HH:mm"
              placeholder="To time"
              onChange={(_, toTime) => {
                if (toTime) {
                  setFilter({...filter, toTime})
                } else {
                  const newFilter: MealsFilter = dissoc("toTime", filter!)
                  setFilter(newFilter)
                }
              }}
            />
          </div>
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={() => {
              setSelectedMeal(undefined)
              openModal()
            }}
          >
            <Icon type="plus" />
            Add meal
          </Button>
        </Col>
      </Row>
      <Row>
        <Table
          rowClassName={() => styles.mealItem}
          rowKey="id"
          dataSource={meals}
          columns={columns}
        />
      </Row>
      <MealForm
        onSave={onSave}
        visible={isOpen}
        onCancel={closeModal}
        meal={selectedMeal}
      />
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
