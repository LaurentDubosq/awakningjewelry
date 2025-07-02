import { ref, type Ref, type ComputedRef, computed, unref } from 'vue'
import type { StatementBannerContent } from '@/types/components'
import type { UseFetchWithStateReturn, FetchState } from '@/types/fetch'
import { defineStore } from 'pinia'
import { getMissionStatementBannerContent } from '@/data/dataFetchers'

export const useMissionStatementBannerContentStore = defineStore(
  'MissionStatementBannerContent',
  () => {
    // States
    const fetchResult: Ref<undefined | UseFetchWithStateReturn<StatementBannerContent>> = ref()

    // Computeds
    const content: ComputedRef<StatementBannerContent | undefined> = computed(() =>
      unref(fetchResult.value?.data),
    )

    const contentFetchState: ComputedRef<FetchState | undefined> = computed(() =>
      unref(fetchResult.value?.state),
    )

    // API Call - Data fetching with data caching
    if (!fetchResult.value) {
      fetchResult.value = getMissionStatementBannerContent()
    }

    return {
      content,
      contentFetchState,
    }
  },
)
