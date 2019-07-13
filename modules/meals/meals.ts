import SQL, {SQLStatement} from "sql-template-strings"
import Joi from "@hapi/joi"

import {ApiRequest, ApiResponse} from "../api-types"
import {query} from "../database"
import {responseOK} from "../api"
import {Meal, MealDTO, AddMealDTO, MealsFilter, DateRange} from "./meals-types"
import {DateTime} from "luxon"
import {validate} from "../validate"
import {path, pathOr} from "ramda"

const timeSchema = Joi.string().regex(
  /^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$/,
)

const dateSchema = Joi.string().isoDate()

const MealsFilterSchema = Joi.object({
  time: Joi.object({
    from: timeSchema.optional(),
    to: timeSchema.optional(),
  }).optional(),
  date: Joi.object({
    from: dateSchema.optional(),
    to: dateSchema.optional(),
  }).optional(),
}).optional()

export async function list(req: ApiRequest): Promise<ApiResponse<MealDTO[]>> {
  const mealsFilter = validate<MealsFilter>(MealsFilterSchema, req.query)

  const now = DateTime.utc().toFormat("yyyy-MM-dd")
  const dateFrom = pathOr("1970-01-01", ["date", "from"], mealsFilter)
  const dateTo = pathOr(now, ["date", "to"], mealsFilter)

  const timeFrom = pathOr("00:00", ["time", "from"], mealsFilter)
  const timeTo = pathOr("24:00", ["time", "to"], mealsFilter)

  const meals = await query<Meal>(
    SQL`select * from meal 
        where (meal.at::date between ${dateFrom} and ${dateTo})
          and (meal.at::time between ${timeFrom} and ${timeTo})`,
  )

  return responseOK(meals.map(toMealDTO))
}

type AddMealPayload = {
  at: Date
  text: string
  calories: number
}

export async function add(req: ApiRequest): Promise<ApiResponse<MealDTO>> {
  const {at, text, calories} = validate<AddMealPayload>(
    Joi.object({
      at: Joi.date(),
      text: Joi.string(),
      calories: Joi.number().positive(),
    }),
    req.body,
  )

  const [meal] = await query<Meal>(
    SQL`insert into meal (at, text, calories) 
        values (${at}, ${text}, ${calories}) returning *`,
  )

  return responseOK(toMealDTO(meal))
}

function toMealDTO(meal: Meal): MealDTO {
  return {
    ...meal,
    at: DateTime.fromJSDate(meal.at)
      .toUTC()
      .toISO(),
  }
}
