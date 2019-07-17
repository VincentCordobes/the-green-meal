import React, {FC} from "react"
import {UserDTO} from "./users/types"
import {useFetch} from "./use-fetch"

export const CurrentUserContext = React.createContext<UserDTO | undefined>(
  undefined,
)

export const CurrentUserProvider: FC = ({children}) => {
  const {data} = useFetch<UserDTO>(`/api/users/current`)

  return (
    <CurrentUserContext.Provider value={data}>
      {children}
    </CurrentUserContext.Provider>
  )
}

export const useCurrentUser = () => {
  return React.useContext(CurrentUserContext)
}
