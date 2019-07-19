import {Person} from "../users/person"

export type Meal = {
  id: number
  at: Date
  text: string
  calories: number
  ownerId: number
}

export type MealDTO = {
  id: number
  text: string
  at: string
  calories: number
}

export type ExpectedMealCalories = {
  fullname: string
} & Pick<Person, "expectedCaloriesPerDay">

export type MealItem = MealDTO & ExpectedMealCalories
export type MealListResponse = MealItem[]

export type AddMealDTO = {
  text: string
  at: string
  calories: number
}

export type RemoveMealPayload = {
  mealId: number
}

export type MealsFilter = {
  fromTime?: string
  toTime?: string
  fromDate?: string
  toDate?: string
}

export type UpdateMealDTO = {
  mealId: number
  values?: Partial<AddMealDTO>
}
