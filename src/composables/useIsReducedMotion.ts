import { ref, type Ref, onUnmounted } from 'vue'

/* Composable to use to return the reduced motion status of the user operating system and/or the browser */
const useIsReducedMotion = () => {
  // Get the reduce motion preference object
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

  // Creation of a Vue controlled variable to keep the DOM in sync with the variable
  const isActivated: Ref<boolean> = ref(prefersReducedMotion.matches)

  // EventListener's callback
  const updateIsActivated = (event: MediaQueryListEvent) => {
    if (event.matches) {
      isActivated.value = event.matches
    } else {
      isActivated.value = event.matches
    }
  }

  // Listen to the user preference toggle and update the controlled Vue variable when toggled
  prefersReducedMotion.addEventListener('change', updateIsActivated)

  // Remove the listener when the component that use it is unmounted
  onUnmounted(() => {
    prefersReducedMotion.removeEventListener('change', updateIsActivated)
  })

  return isActivated
}
export default useIsReducedMotion
