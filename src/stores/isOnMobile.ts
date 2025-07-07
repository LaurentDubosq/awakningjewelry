import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import useIsOnMobile from '../composables/useIsOnMobile'

export const useIsOnMobileStore = defineStore('IsOnMobile', () => {
  // States
  const isOnMobile: Ref<boolean> = ref(useIsOnMobile())

  // Store return
  return { isOnMobile }
})
