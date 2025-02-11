import { ref, type Ref, type ComputedRef, computed, unref } from 'vue'
import type { HeroSlideType } from '@/types/components'
import type { UseFetchWithStateReturn, FetchStatus } from '@/types/fetch'
import { defineStore } from 'pinia'

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
  const heroSlidesFetchStatus: ComputedRef<FetchStatus | undefined> = computed(() =>
    unref(heroSlidesResult.value?.status),
  )

  // Methods
  const updateHeroSlidesResult = (newSlidesResult: UseFetchWithStateReturn<HeroSlideType[]>) => {
    heroSlidesResult.value = newSlidesResult
  }

  return {
    heroSlidesResult,
    heroSlidesData,
    heroSlidesDataLength,
    heroSlidesFetchStatus,
    updateHeroSlidesResult,
  }
})
