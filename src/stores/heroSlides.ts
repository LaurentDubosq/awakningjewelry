import { ref, type Ref, type ComputedRef, computed, unref } from 'vue'
import type { HeroSlideType } from '@/types/components'
import type { UseFetchWithStateReturn, FetchState } from '@/types/fetch'
import { defineStore } from 'pinia'
import { getHeroSlides } from '@/data/dataFetchers'

export const useHeroSlidesResultStore = defineStore('HeroSlidesResult', () => {
  // States
  const heroSlidesResult: Ref<undefined | UseFetchWithStateReturn<HeroSlideType[]>> = ref()

  // Computeds
  const heroSlidesData: ComputedRef<HeroSlideType[] | undefined> = computed(() =>
    unref(heroSlidesResult.value?.data),
  )
  const heroSlidesDataLength: ComputedRef<number | undefined> = computed(
    () => heroSlidesData.value?.length,
  )
  const heroSlidesFetchState: ComputedRef<FetchState | undefined> = computed(() =>
    unref(heroSlidesResult.value?.status),
  )

  // Methods
  const updateHeroSlidesResult = (newSlidesResult: UseFetchWithStateReturn<HeroSlideType[]>) => {
    heroSlidesResult.value = newSlidesResult
  }

  // API Call - Data fetching with data caching
  if (!heroSlidesResult.value) {
    heroSlidesResult.value = getHeroSlides()
  }

  return {
    heroSlidesResult,
    heroSlidesData,
    heroSlidesDataLength,
    heroSlidesFetchState,
    updateHeroSlidesResult,
  }
})
