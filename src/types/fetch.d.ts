import { type Ref } from 'vue'
import { type FetchState } from './utils'

export interface UseFetchWithStateReturn<T> {
  data: Ref<T | undefined>
  status: Ref<FetchState>
}

export type FetchState = 'pending' | 'fulfilled' | 'rejected'
