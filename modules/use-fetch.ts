import {useState, useEffect} from "react"
import {request} from "./http-client"

// export const useFetch = <T>(url: string) => {
//   const [data, setData] = useState<T|null>(null)
//   const [error, setError] = useState<>(null)
//   const [loading, setLoading] = useState(true)
//
//   useEffect(() => {
//     setLoading(true)
//     request<T>(url).then(response => {
//       setLoading(false)
//       if (response.ok) {
//         setData(response)
//
//       } else {
//         setError(!response.ok && response.
//       }
//     })
//   }, [])
//   return {data, loading, error}
// }
