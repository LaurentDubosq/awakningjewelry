import { ref, type Ref, type ComputedRef, computed, unref } from 'vue'
import type { ProductListingContent } from '@/types/components'
import type { UseFetchWithStateReturn, FetchState } from '@/types/fetch'
import { defineStore } from 'pinia'
import { getPromotionsProductListingContent } from '@/data/dataFetchers'

export const usePromotionsProductListingContentStore = defineStore(
  'PromotionsProductListingContent',
  () => {
    // States
    const fetchResult: Ref<undefined | UseFetchWithStateReturn<ProductListingContent>> = ref()

    // Computeds
    const content: ComputedRef<ProductListingContent | undefined> = computed(() =>
      unref(fetchResult.value?.data),
    )

    const contentFetchState: ComputedRef<FetchState | undefined> = computed(() =>
      unref(fetchResult.value?.state),
    )

    // API Call - Data fetching with data caching
    if (!fetchResult.value) {
      fetchResult.value = getPromotionsProductListingContent()
    }

    return {
      content,
      contentFetchState,
    }
  },
)
