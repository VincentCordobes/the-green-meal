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
  expectedCaloriesPerDay: number | null
}

export type MealItem = MealDTO & ExpectedMealCalories

export type MealListResponse = MealItem[]

export type AddMealRequest = {
  text: string
  at: string
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
