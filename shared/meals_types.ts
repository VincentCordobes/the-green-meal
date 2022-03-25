/** ISO8601 time part without tz */
export const TIME_FORMAT = "HH:mm"
/** ISO8601 date part */
export const DATE_FORMAT = "YYYY-MM-DD"

export type Meal = {
  id: number
  atDate: string
  atTime: string
  text: string
  calories: number
  ownerId: number
}

export type MealDTO = {
  id: number
  text: string
  atDate: string
  atTime: string
  calories: number
}

export type ExpectedMealCalories = {
  fullname: string
  expectedCaloriesPerDay: number | null
}

export type MealItem = MealDTO & ExpectedMealCalories

export type MealListResponse = MealItem[]

export type AddMealRequest = {
  text: string
  atDate: string
  atTime: string
  calories: number
}

export type RemoveMealRequest = {
  mealId: number
}

export type MealsFilter = {
  fromTime?: string
  toTime?: string
  fromDate?: string
  toDate?: string
}

export type UpdateMealRequest = {
  mealId: number
  values?: Partial<AddMealRequest>
}
