import SASSCONSTANTS from '@/assets/styles/_constants.module.scss'
import { ref, type Ref, onMounted, onUnmounted } from 'vue'

// Get the SCSS desktop breakpoint
const awakningBreakpointDesktop = parseFloat(SASSCONSTANTS.AwakningBreakpointDesktop)

// Check if the screen is in mobile mode
const checkIsOnMobile = (): boolean => window.innerWidth < awakningBreakpointDesktop

// Detects mobile/desktop environment at initial render
const isOnMobile: Ref<boolean> = ref(checkIsOnMobile())

// Update the state at every window resize
const updateIsOnMobile = () => {
  isOnMobile.value = checkIsOnMobile()
}

export const useIsOnMobile = (): Ref<boolean> => {
  onMounted(() => {
    window.addEventListener('resize', updateIsOnMobile)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateIsOnMobile)
  })

  return isOnMobile
}
