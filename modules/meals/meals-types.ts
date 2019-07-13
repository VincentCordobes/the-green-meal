export type Meal = {
  id: number
  at: Date
  text: string
  calories: number
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

export type DateRange = {
  from?: string
  to?: string
}

export type MealsFilter = {
  time?: DateRange
  date?: DateRange
}
