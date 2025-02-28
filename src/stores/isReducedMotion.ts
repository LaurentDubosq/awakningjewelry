import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import useIsReducedMotion from '@/composables/useIsReducedMotion'

export const useIsReducedMotionStore = defineStore('IsReducedMotion', () => {
  // States
  const isReducedMotion: Ref<boolean> = ref(useIsReducedMotion())

  // Store return
  return { isReducedMotion }
})
