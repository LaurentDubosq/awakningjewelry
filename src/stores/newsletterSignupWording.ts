import { ref, type Ref, type ComputedRef, computed, unref } from 'vue'
import type { NewsletterSignupWording } from '@/types/components'
import type { UseFetchWithStateReturn, FetchState } from '@/types/fetch'
import { defineStore } from 'pinia'
import { getNewsletterSignupWordingAsyncResult } from '@/data/dataFetchers'

export const useNewsletterSignupWordingResultStore = defineStore(
  'NewsletterSignupWordingResult',
  () => {
    // States
    const wordingFetchResult: Ref<undefined | UseFetchWithStateReturn<NewsletterSignupWording>> =
      ref()

    // Computeds
    const wording: ComputedRef<NewsletterSignupWording | undefined> = computed(() =>
      unref(wordingFetchResult.value?.data),
    )
    const wordingFetchState: ComputedRef<FetchState | undefined> = computed(() =>
      unref(wordingFetchResult.value?.status),
    )

    // Data fetching with data caching
    if (!wordingFetchResult.value) {
      wordingFetchResult.value = getNewsletterSignupWordingAsyncResult()
    }

    return {
      wording,
      wordingFetchState,
    }
  },
)
