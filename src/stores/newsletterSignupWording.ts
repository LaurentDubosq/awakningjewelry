import { ref, type Ref, type ComputedRef, computed, unref } from 'vue'
import type { NewsletterSignupWording } from '@/types/components'
import type { UseFetchWithStateReturn, FetchState } from '@/types/fetch'
import { defineStore } from 'pinia'
import { getNewsletterSignupWording } from '@/data/dataFetchers'

export const useNewsletterSignupWordingStore = defineStore('NewsletterSignupWording', () => {
  // States
  const fetchResult: Ref<undefined | UseFetchWithStateReturn<NewsletterSignupWording>> = ref()

  // Computeds
  const wording: ComputedRef<NewsletterSignupWording | undefined> = computed(() =>
    unref(fetchResult.value?.data),
  )
  const wordingFetchState: ComputedRef<FetchState | undefined> = computed(() =>
    unref(fetchResult.value?.status),
  )

  // Data fetching with data caching
  if (!fetchResult.value) {
    fetchResult.value = getNewsletterSignupWording()
  }

  return {
    wording,
    wordingFetchState,
  }
})
