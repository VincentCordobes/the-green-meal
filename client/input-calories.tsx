import React, {FC} from "react"
import InputNumber, {InputNumberProps} from "antd/lib/input-number"

const MAX_CALORIES = 900000

export const InputCalories: FC<InputNumberProps> = props => {
  return (
    <InputNumber
      {...props}
      type="number"
      max={MAX_CALORIES}
      style={{width: "100%"}}
    />
  )
}

export function validateCalorieCount(
  _: any,
  value: number,
  cb: (error?: string) => void,
) {
  if (value <= 0) {
    return cb("Calories must be positive")
  }

  if (value > MAX_CALORIES) {
    return cb("You can't eat that much!")
  }

  return cb()
}
