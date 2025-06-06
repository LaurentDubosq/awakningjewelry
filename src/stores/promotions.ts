import { ref, type Ref, type ComputedRef, computed, unref } from 'vue'
import type { ProductSummary } from '@/types/global.d.ts'
import type { UseFetchWithStateReturn, FetchState } from '@/types/fetch'
import { defineStore } from 'pinia'
import { getPromotions } from '@/data/dataFetchers'

export const usePromotionsResultStore = defineStore('PromotionsResult', () => {
  // States
  const promotionsResult: Ref<undefined | UseFetchWithStateReturn<ProductSummary[]>> = ref()

  // Computeds
  const promotionsResultData: ComputedRef<ProductSummary[] | undefined> = computed(() =>
    unref(promotionsResult.value?.data),
  )

  const promotionsResultFetchState: ComputedRef<FetchState | undefined> = computed(() =>
    unref(promotionsResult.value?.status),
  )

  // Methods
  const updatePromotionsResult = (
    newPromotionsResult: UseFetchWithStateReturn<ProductSummary[]>,
  ) => {
    promotionsResult.value = newPromotionsResult
  }

  // API Call - Data fetching with data caching
  if (!promotionsResult.value) {
    promotionsResult.value = getPromotions()
  }

  return {
    promotionsResult,
    promotionsResultData,
    promotionsResultFetchState,
    updatePromotionsResult,
  }
})
