import {useState, useEffect, useRef} from "react"
import {request} from "./http-client"

type Options<T> = {
  body?: any
  params?: any
  initialData?: T
}
export const useFetch = <T>(
  url: string,
  {body, initialData, params}: Options<T>,
) => {
  const isInitialFetch = useRef(true)
  const [data, setData] = useState<T | undefined>(initialData)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    request<T>(url, {body, params}).then(response => {
      setLoading(false)
      isInitialFetch.current = false
      if (response.ok) {
        setData(response.value)
      } else {
        setError(response.error)
      }
    })
  }, [url, body, params])

  return {
    data,
    loading,
    error,
    setData,
    isInitialFetch: isInitialFetch.current,
  }
}
