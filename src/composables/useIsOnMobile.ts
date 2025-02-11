import SASSCONSTANTS from '@/assets/styles/_constants.module.scss'
import { ref, type Ref, onMounted, onUnmounted } from 'vue'

// Get the SCSS desktop breakpoint
const awakningBreakpointDesktop = parseFloat(SASSCONSTANTS.AwakningBreakpointDesktop)

// Detects mobile/desktop environment at initial render
const isOnMobile: Ref<boolean> = ref(window.innerWidth < awakningBreakpointDesktop)

const updateIsOnMobile = () => {
  isOnMobile.value = window.innerWidth < awakningBreakpointDesktop
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
