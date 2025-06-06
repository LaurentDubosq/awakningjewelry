import { ref, type Ref } from 'vue'
import type { UseFetchWithStateReturn } from '@/types/fetch'
import type { FetchState } from '@/types/fetch'

// Composable to fetch external data returning them with a dynamic request statut
export const useFetchWithState = <T>(
  url: string,
  options?: RequestInit,
): UseFetchWithStateReturn<T> => {
  const data: Ref<T | undefined> = ref()
  const status: Ref<FetchState> = ref('pending')

  const fetchData = async () => {
    try {
      const response = await fetch(url, options)

      if (response.ok) {
        data.value = await response.json()
        status.value = 'fulfilled'
      } else {
        const errorMessage = `${response.status} - ${response.statusText}`
        throw new Error(errorMessage)
      }
    } catch (error) {
      status.value = 'rejected'
      if (error instanceof TypeError) {
        console.log('Network error: Please check your internet connection or the request URL.')
      } else {
        console.log('Error encountered after the Fetch execution :', error)
      }
    }
  }
  fetchData()

  return { data, status }
}
