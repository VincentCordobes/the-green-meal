import sql, {empty} from "sql-template-tag"
import Joi from "@hapi/joi"
import {propOr, pick} from "ramda"

import {ApiResponse} from "../shared/api-types"
import {
  Meal,
  MealDTO,
  MealsFilter,
  RemoveMealRequest,
  UpdateMealRequest,
  MealListResponse,
  ExpectedMealCalories,
  AddMealRequest,
} from "../shared/meals-types"

import {validate} from "./validate"
import {
  query,
  buildUpdateFields,
  queryOne,
  buildValues1,
  buildUpdateFields1,
} from "./database"
import {responseOK, ApiRequest} from "./api"
import {withACLs} from "./with-auth"
import {HTTPError} from "./error-handler"

const timeSchema = Joi.string().regex(
  /^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$/,
)

const dateSchema = Joi.string().regex(
  /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/,
)

const MealsFilterSchema = Joi.object({
  fromTime: timeSchema.optional(),
  toTime: timeSchema.optional(),
  fromDate: dateSchema.optional(),
  toDate: dateSchema.optional(),
}).optional()

export const list = withACLs(
  ["regular", "admin", "manager"],
  async (req: ApiRequest, params): Promise<ApiResponse<MealListResponse>> => {
    const mealsFilter = validate<MealsFilter>(MealsFilterSchema, req.query)

    const dateFrom: string = propOr("-infinity", "fromDate", mealsFilter)
    const dateTo: string = propOr("infinity", "toDate", mealsFilter)

    const timeFrom: string = propOr("00:00", "fromTime", mealsFilter)
    const timeTo: string = propOr("24:00", "toTime", mealsFilter)

    const ownerFilter =
      params.role !== "admin" ? sql` and owner_id = ${params.userId}` : empty

    const sqlQuery = sql`
      select meal.id, meal.at_date, meal.at_time, meal.text, meal.calories,
             concat(p.firstname, ' ', p.lastname) as fullname,
             p.expected_calories_per_day
        from meal join person p on p.id = meal.owner_id
       where (meal.at_date::date between ${dateFrom} and ${dateTo})
         and (meal.at_time::time between ${timeFrom} and ${timeTo})
             ${ownerFilter}
         order by meal.at_date::date desc, meal.at_time::time desc`

    type DbQueryResult = Meal & ExpectedMealCalories
    const meals = await query<DbQueryResult>(sqlQuery)

    return {
      ok: true,
      value: meals,
    }
  },
)

export const add = withACLs(
  ["regular", "admin", "manager"],
  async (req: ApiRequest, {userId: ownerId}): Promise<ApiResponse<MealDTO>> => {
    const {atDate, atTime, text, calories} = validate<AddMealRequest>(
      Joi.object({
        atTime: timeSchema,
        atDate: dateSchema,
        text: Joi.string(),
        calories: Joi.number()
          .positive()
          .max(900000),
      }),
      req.body,
    )

    const values = buildValues1({
      atDate,
      atTime,
      text,
      calories,
      ownerId,
    })
    const [meal] = await query<Meal>(
      sql`insert into meal ${values} returning *`,
    )

    return responseOK(toMealDTO(meal))
  },
)

export const update = withACLs(
  ["regular", "admin", "manager"],
  async (req, {userId, role}): Promise<ApiResponse<MealDTO>> => {
    const {mealId, values} = validate<UpdateMealRequest>(
      Joi.object({
        mealId: Joi.number(),
        values: Joi.object({
          atTime: timeSchema.optional(),
          atDate: dateSchema.optional(),
          text: Joi.string().optional(),
          calories: Joi.number()
            .positive()
            .optional(),
        }).optional(),
      }).optional(),
      req.body,
    )

    if (!values || !Object.keys(values).length) {
      const meal = await queryOne<Meal>(
        sql`select * from meal
        ${role !== "admin" ? sql`where owner_id = ${userId}` : empty} `,
      )

      return responseOK(toMealDTO(meal))
    }

    const meal = await queryOne<Meal>(
      sql`update meal 
          set ${buildUpdateFields1(values)}
          where meal.id = ${mealId}
          ${role !== "admin" ? sql` and owner_id = ${userId}` : empty}
          returning *`,
    )
    return responseOK(toMealDTO(meal))
  },
)

export const remove = withACLs(
  ["regular", "admin", "manager"],
  async (req, {userId, role}) => {
    const {mealId} = validate<RemoveMealRequest>(
      Joi.object({mealId: Joi.number()}),
      req.body,
    )

    const ownerFilter =
      role !== "admin" ? sql` and owner_id = ${userId}` : empty

    const [meal] = await query<Meal>(
      sql`delete from meal
          where id = ${mealId}
                ${ownerFilter}
          returning * `,
    )

    if (!meal) {
      throw new HTTPError(401)
    }

    return responseOK(toMealDTO(meal))
  },
)

function toMealDTO(meal: Meal): MealDTO {
  return pick(["id", "text", "calories", "atDate", "atTime"], meal)
}
