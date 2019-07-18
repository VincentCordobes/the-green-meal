import {useState, useEffect, useRef, useCallback} from "react"
import {request} from "./http-client"

type Options<T> = {
  body?: any
  params?: any
  initialData?: T
}
export const useFetch = <T>(
  url: string,
  {body, initialData, params}: Options<T> = {},
) => {
  const isInitialFetch = useRef(true)
  const [data, setData] = useState<T | undefined>(initialData)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    const response = await request<T>(url, {body, params})
    setLoading(false)
    isInitialFetch.current = false

    if (response.ok) {
      setData(response.value)
    } else {
      setError(response.error)
    }
  }, [url, body, params])

  useEffect(() => {
    fetch()
    return () => {}
  }, [fetch])

  return {
    data,
    loading,
    error,
    setData,
    refetch: fetch,
    isInitialFetch: isInitialFetch.current,
  }
}
