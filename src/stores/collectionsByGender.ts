import { ref, type Ref, type ComputedRef, computed, unref } from 'vue'
import type { UseFetchWithStateReturn, FetchState } from '@/types/fetch'
import { defineStore } from 'pinia'
import { getCollectionListingByGender } from '@/data/dataFetchers'
import type { CollectionListing } from '@/types/components'

export const useCollectionListingByGenderStore = defineStore('CollectionListingByGender', () => {
  // States
  const fetchResult: Ref<undefined | UseFetchWithStateReturn<CollectionListing>> = ref()

  // Computeds
  const content: ComputedRef<CollectionListing | undefined> = computed(() =>
    unref(fetchResult.value?.data),
  )

  const contentFetchState: ComputedRef<FetchState | undefined> = computed(() =>
    unref(fetchResult.value?.status),
  )

  // API Call - Data fetching with data caching
  if (!fetchResult.value) {
    fetchResult.value = getCollectionListingByGender()
  }

  return {
    content,
    contentFetchState,
  }
})
