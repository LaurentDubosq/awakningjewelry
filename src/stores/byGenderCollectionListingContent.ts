import { ref, type Ref, type ComputedRef, computed, unref } from 'vue'
import type { UseFetchWithStateReturn, FetchState } from '@/types/fetch'
import { defineStore } from 'pinia'
import { getByGenderCollectionListingContent } from '@/data/dataFetchers'
import type { CollectionListingContent } from '@/types/components'

export const useByGenderCollectionListingContentStore = defineStore(
  'ByGenderCollectionListingContent',
  () => {
    // States
    const fetchResult: Ref<undefined | UseFetchWithStateReturn<CollectionListingContent>> = ref()

    // Computeds
    const content: ComputedRef<CollectionListingContent | undefined> = computed(() =>
      unref(fetchResult.value?.data),
    )

    const contentFetchState: ComputedRef<FetchState | undefined> = computed(() =>
      unref(fetchResult.value?.status),
    )

    // API Call - Data fetching with data caching
    if (!fetchResult.value) {
      fetchResult.value = getByGenderCollectionListingContent()
    }

    return {
      content,
      contentFetchState,
    }
  },
)
