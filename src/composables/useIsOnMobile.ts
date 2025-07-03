import sassConstants from '@/assets/styles/_constants.module.scss'
import { ref, type Ref, onMounted, onUnmounted } from 'vue'

/* Composable to use to get element the environment - mobile or desktop */

// Get the SCSS desktop breakpoint
const breakpointDesktop = parseFloat(sassConstants.breakpointDesktop)

// Create function to detect if the screen is in mobile mode
const checkIsOnMobile = (): boolean => window.innerWidth < breakpointDesktop

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
