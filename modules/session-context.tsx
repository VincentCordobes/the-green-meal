import React, {FC} from "react"
import {UserDTO} from "./users/types"
import {useFetch} from "./use-fetch"

export const CurrentUserContext = React.createContext<
  {currentUser: UserDTO; refresh: () => void} | undefined
>(undefined)

export const CurrentUserProvider: FC<{initialData: UserDTO}> = ({
  initialData,
  children,
}) => {
  const {data: currentUser, refetch: refresh} = useFetch<UserDTO>(
    `/api/users/current`,
    {initialData},
  )

  return (
    <CurrentUserContext.Provider
      value={{currentUser: currentUser || initialData, refresh}}
    >
      {children}
    </CurrentUserContext.Provider>
  )
}

export const useCurrentUser = () => {
  const context = React.useContext(CurrentUserContext)
  if (context === undefined) {
    throw new Error(
      "CurrentUserContext must be used within a CurrentUserContext provider",
    )
  }
  return context
}
