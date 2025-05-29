import { ref, type Ref, type ComputedRef, computed, unref } from 'vue'
import type { StatementBannerWording } from '@/types/components'
import type { UseFetchWithStateReturn, FetchStatus } from '@/types/fetch'
import { defineStore } from 'pinia'
import { getStatementMissionWordingAsyncResult } from '@/data/dataFetchers'

export const useStatementMissionWordingResultStore = defineStore(
  'StatementMissionWordingResult',
  () => {
    // States
    const wordingFetchResult: Ref<undefined | UseFetchWithStateReturn<StatementBannerWording>> =
      ref()

    // Computeds
    const wording: ComputedRef<StatementBannerWording | undefined> = computed(() =>
      unref(wordingFetchResult.value?.data),
    )

    const wordingFetchStatus: ComputedRef<FetchStatus | undefined> = computed(() =>
      unref(wordingFetchResult.value?.status),
    )

    // API Call - Data fetching with data caching
    if (!wordingFetchResult.value) {
      wordingFetchResult.value = getStatementMissionWordingAsyncResult()
    }

    return {
      wording,
      wordingFetchStatus,
    }
  },
)
