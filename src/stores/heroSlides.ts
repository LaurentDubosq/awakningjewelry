import { ref, type Ref, type ComputedRef, computed, unref } from 'vue'
import type { HeroSlideType } from '@/types/features'
import type { UseFetchWithStateReturn, FetchState } from '@/types/fetch'
import { defineStore } from 'pinia'
import { getHeroSlides } from '@/data/dataFetchers'

export const useHeroSlidesStore = defineStore('HeroSlides', () => {
  // States
  const fetchResult: Ref<undefined | UseFetchWithStateReturn<HeroSlideType[]>> = ref()

  // Computeds
  const heroSlides: ComputedRef<HeroSlideType[] | undefined> = computed(() =>
    unref(fetchResult.value?.data),
  )
  const heroSlidesLength: ComputedRef<number | undefined> = computed(() => heroSlides.value?.length)
  const heroSlidesFetchState: ComputedRef<FetchState | undefined> = computed(() =>
    unref(fetchResult.value?.state),
  )

  // API Call - Data fetching with data caching
  if (!fetchResult.value) {
    fetchResult.value = getHeroSlides()
  }

  return {
    heroSlides,
    heroSlidesLength,
    heroSlidesFetchState,
  }
})
