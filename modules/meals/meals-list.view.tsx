import React, {FC, useState} from "react"
import Table, {ColumnProps} from "antd/lib/table"
import Tag from "antd/lib/tag"
import {MealDTO, MealsFilter} from "./meals-types"
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
import Tooltip from "antd/lib/tooltip"
import Popconfirm from "antd/lib/popconfirm"
import {useCurrentUser} from "../session-context"
import {UserDTO} from "../users/types"

const {RangePicker} = DatePicker

function buildColumns(
  user: UserDTO,
  params: {
    onDelete: (meal: MealDTO) => any
    onEdit: (meal: MealDTO) => any
  },
): ColumnProps<MealDTO>[] {
  return [
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
      render: (calories: number) => {
        let color
        if (user.expectedCaloriesPerDay) {
          if (user.expectedCaloriesPerDay < calories) {
            color = "#f5222d"
          } else {
            color = "#7cb305"
          }
        }
        return (
          <Tag color={color}>
            <span className="meal-calories">{calories} kCal</span>
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
            <Button type="link" onClick={() => params.onEdit(user)}>
              <Icon type="edit" />
            </Button>
          </Tooltip>
          <Divider type="vertical" />
          <Popconfirm
            title="Are you sure you want to delete this meal?"
            onConfirm={() => params.onDelete(user)}
          >
            <Tooltip title="Delete" placement="bottom">
              <a>
                <Icon type="delete" />
              </a>
            </Tooltip>
          </Popconfirm>
        </>
      ),
    },
  ]
}

type Props = {
  meals: MealDTO[]
}

export const MealList: FC<Props> = props => {
  const {isOpen, openModal, closeModal} = useModal()
  const [filter, setFilter] = useState<MealsFilter>()
  const [selectedMeal, setSelectedMeal] = useState<MealDTO>()
  const {data: meals, refetch} = useFetch<MealDTO[]>("/api/meals", {
    params: filter,
    initialData: props.meals,
  })

  const {currentUser} = useCurrentUser()
  if (!currentUser) {
    return null
  }

  const onSave = async () => {
    await refetch()
    closeModal()
  }

  const columns = buildColumns(currentUser, {
    onDelete: async meal => {
      await request("/api/meals/remove", {
        method: "POST",
        body: {mealId: meal.id},
      })

      await refetch()
      message.success(`Meal successfully removed`)
    },
    onEdit: meal => {
      setSelectedMeal(meal)
      openModal()
    },
  })

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
