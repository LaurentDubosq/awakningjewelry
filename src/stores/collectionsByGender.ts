import { ref, type Ref, type ComputedRef, computed, unref } from 'vue'
import type { Collection } from '@/types/global.d.ts'
import type { UseFetchWithStateReturn, FetchStatus } from '@/types/fetch'
import { defineStore } from 'pinia'

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

  return {
    collectionsByGenderResult,
    collectionsByGenderData,
    collectionsByGenderFetchStatus,
    updateCollectionsByGenderResult,
  }
})
