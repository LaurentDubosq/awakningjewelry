import { ref, type Ref, type ComputedRef, computed, unref } from 'vue'
import type { QuoteBannerContent } from '@/types/components'
import type { UseFetchWithStateReturn, FetchStatus } from '@/types/fetch'
import { defineStore } from 'pinia'
import { getFounderQuoteBannerContentAsyncResult } from '@/data/dataFetchers'

export const useFounderQuoteBannerContentResultStore = defineStore(
  'FounderQuoteBannerContentResult',
  () => {
    // States
    const contentFetchResult: Ref<undefined | UseFetchWithStateReturn<QuoteBannerContent>> = ref()

    // Computeds
    const content: ComputedRef<QuoteBannerContent | undefined> = computed(() =>
      unref(contentFetchResult.value?.data),
    )

    const contentFetchState: ComputedRef<FetchStatus | undefined> = computed(() =>
      unref(contentFetchResult.value?.status),
    )

    // API Call - Data fetching with data caching
    if (!contentFetchResult.value) {
      contentFetchResult.value = getFounderQuoteBannerContentAsyncResult()
    }

    return {
      content,
      contentFetchState,
    }
  },
)
