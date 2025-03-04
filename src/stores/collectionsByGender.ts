import { ref, type Ref, type ComputedRef, computed, unref } from 'vue'
import type { Collection } from '@/types/global.d.ts'
import type { UseFetchWithStateReturn, FetchStatus } from '@/types/fetch'
import { defineStore } from 'pinia'
import { getCollectionsByGender } from '@/data/dataFetchers'

export const useCollectionsByGenderResultStore = defineStore('CollectionsByGenderResult', () => {
  // States
  const collectionsByGenderResult: Ref<undefined | UseFetchWithStateReturn<Collection[]>> = ref()

  // Computeds
  const collectionsByGenderData: ComputedRef<Collection[] | undefined> = computed(() =>
    unref(collectionsByGenderResult.value?.data),
  )

  const collectionsByGenderFetchStatus: ComputedRef<FetchStatus | undefined> = computed(() =>
    unref(collectionsByGenderResult.value?.status),
  )

  // Methods
  const updateCollectionsByGenderResult = (
    newCollectionsByGenderResult: UseFetchWithStateReturn<Collection[]>,
  ) => {
    collectionsByGenderResult.value = newCollectionsByGenderResult
  }

  // API Call - Data fetching with data caching
  if (!collectionsByGenderResult.value) {
    collectionsByGenderResult.value = getCollectionsByGender()
  }

  return {
    collectionsByGenderResult,
    collectionsByGenderData,
    collectionsByGenderFetchStatus,
    updateCollectionsByGenderResult,
  }
})
