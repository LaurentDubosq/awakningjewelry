import { defineStore } from 'pinia'
import { onMounted, onUnmounted, ref, type Ref } from 'vue'
import sassConstants from '@/assets/styles/_constants.module.scss'

export const useIsBurgerMenuOpenStore = defineStore('IsBurgerMenuOpen', () => {
  // States
  const isBurgerMenuOpen: Ref<boolean> = ref(false)

  // Methods
  const toggleBurgerMenu = () => {
    // Toggle the opening of the burger menu
    isBurgerMenuOpen.value = !isBurgerMenuOpen.value

    // Prevent body scroll when the burger menu is open
    if (isBurgerMenuOpen.value) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'visible'
    }
  }

  /***************************************************************/
  /* Closes the burger menu when resizing from mobile to desktop */
  /***************************************************************/

  // Get the desktop breakpoint value from design system
  const breakpointDesktop: number = Number(sassConstants.breakpointDesktop.slice(0, -2))

  // Logic to close the burger menu when we resize the window width from mobile to desktop.
  const closeBurgerMenuOnDesktop = () => {
    if (
      document.documentElement.clientWidth >= breakpointDesktop &&
      isBurgerMenuOpen.value !== false
    ) {
      isBurgerMenuOpen.value = false
      document.body.style.overflow = 'visible'
    }
  }

  // Check at every window resize if burger menu should be closed
  onMounted(() => {
    window.addEventListener('resize', closeBurgerMenuOnDesktop)
  })

  // Remove the listener
  onUnmounted(() => {
    window.removeEventListener('resize', closeBurgerMenuOnDesktop)
  })

  return { isBurgerMenuOpen, toggleBurgerMenu }
})
