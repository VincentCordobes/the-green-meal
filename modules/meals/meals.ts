import SQL from "sql-template-strings"
import Joi from "@hapi/joi"

import {ApiRequest, ApiResponse} from "../api-types"
import {query} from "../database"
import {responseOK} from "../api"
import {Meal, MealDTO, AddMealDTO} from "./meals-types"
import {DateTime} from "luxon"
import {validate} from "../validate"

export async function list(req: ApiRequest): Promise<ApiResponse<MealDTO[]>> {
  const meals = await query<Meal>(SQL`select * from meal`)

  return responseOK(meals.map(toMealDTO))
}

export async function add(req: ApiRequest): Promise<ApiResponse<MealDTO>> {
  const {at, text, calories} = validate<AddMealDTO>(
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
