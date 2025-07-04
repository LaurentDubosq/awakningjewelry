import { ref, type Ref, type ComputedRef, computed, unref } from 'vue'
import type { QuoteBannerContent } from '@/types/features'
import type { UseFetchWithStateReturn, FetchState } from '@/types/fetch'
import { defineStore } from 'pinia'
import { getFounderQuoteBannerContent } from '@/data/dataFetchers'

export const useFounderQuoteBannerContentStore = defineStore('FounderQuoteBannerContent', () => {
  // States
  const fetchResult: Ref<undefined | UseFetchWithStateReturn<QuoteBannerContent>> = ref()

  // Computeds
  const content: ComputedRef<QuoteBannerContent | undefined> = computed(() =>
    unref(fetchResult.value?.data),
  )

  const contentFetchState: ComputedRef<FetchState | undefined> = computed(() =>
    unref(fetchResult.value?.state),
  )

  // API Call - Data fetching with data caching
  if (!fetchResult.value) {
    fetchResult.value = getFounderQuoteBannerContent()
  }

  return {
    content,
    contentFetchState,
  }
})
