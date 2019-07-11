import SQL from "sql-template-strings"

import {ApiRequest, ApiResponse} from "./api-types"
import {query} from "./database"
import {responseOK} from "./api"

type Meal = {
  id: number
  at: Date
  text: string
  calories: number
}

type MealList = {
  meals: Meal[]
}

export async function list(req: ApiRequest): Promise<ApiResponse<MealList>> {
  const meals = await query<Meal>(SQL`select * from meal`)

  return responseOK({meals})
}
