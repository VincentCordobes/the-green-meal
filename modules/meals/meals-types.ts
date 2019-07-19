export type Meal = {
  id: number
  at: Date
  text: string
  calories: number
  ownerId: number | null
}

export type MealDTO = {
  id: number
  text: string
  at: string
  calories: number
}

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
