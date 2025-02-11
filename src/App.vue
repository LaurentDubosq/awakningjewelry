<script setup lang="ts">
import { onMounted, onUnmounted, ref, provide, type Ref } from 'vue'
import { RouterView } from 'vue-router'
import SiteHeader from './components/SiteHeader.vue'
import BurgerMenu from './components/BurgerMenu.vue'
import MyTransition from './components/MyTransition.vue'

/*************/
/* Site Menu */
/*************/

// Provide the site menu (to: SiteNav.vue)
import type { SiteMenuItem } from './types/components'
import { getSiteMenu } from './data/dataFetchers'
import { siteMenuKey } from './utils/injectionkeys'

const siteMenuResult: UseFetchWithStateReturn<SiteMenuItem[]> = getSiteMenu()

provide(siteMenuKey, siteMenuResult)

/***************/
/* Burger Menu */
/***************/

const isBurgerMenuOpen: Ref<boolean> = ref(false)

/* Provide the burger menu opening status (to: BurgerMenuToggle.vue) */
import { isBurgerMenuOpenKey } from './utils/injectionkeys'

provide(isBurgerMenuOpenKey, isBurgerMenuOpen)

/* Provide the burger menu logic necessary to toggle the burger menu (to: BurgerMenuLink.vue, BurgerMenuDropdownItem.vue, BurgerMenuToggle.vue) */
import { toggleBurgerMenuKey } from './utils/injectionkeys'

function toggleBurgerMenu() {
  isBurgerMenuOpen.value = !isBurgerMenuOpen.value
}

provide(toggleBurgerMenuKey, toggleBurgerMenu)

/* Logic to close the burger menu when switch from mobile to desktop */
// Get SASS Constants to use it in Javascript
import SASSCONSTANTS from '@/assets/styles/_constants.module.scss'

// Get the desktop breakpoint value from design system
const DESKTOPBREAKPOINT: number = Number(SASSCONSTANTS.AwakningBreakpointDesktop.slice(0, -2))

// Logic to close the burger menu when we resize the window width from mobile to desktop.
function closeBurgerMenuOnDesktop() {
  if (
    document.documentElement.clientWidth >= DESKTOPBREAKPOINT &&
    isBurgerMenuOpen.value !== false
  ) {
    isBurgerMenuOpen.value = false
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

/********************/
/* Global Variables */
/********************/

// Provide mobile/desktop environment (to: whole app)
import { useIsOnMobile } from './composables/useIsOnMobile'
import { useIsOnMobileKey } from './utils/injectionkeys'
import type { UseFetchWithStateReturn } from './types/fetch'

provide(useIsOnMobileKey, useIsOnMobile())
</script>

<template>
  <div class="site-container">
    <MyTransition name="marginLeftMinus300px" :group="false">
      <BurgerMenu :siteMenuResult @close-burger-menu="toggleBurgerMenu" v-if="isBurgerMenuOpen" />
    </MyTransition>
    <div class="site-content">
      <div class="site-content-container">
        <SiteHeader />
        <main>
          <RouterView />
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants.scss' as *;

.site-container {
  display: flex;
}
.site-content {
  flex: 1;
  overflow: hidden;

  &-container {
    min-width: $AwakningBreakpointMobileMinWidth; // Allow the content to be overflowing on mobile when burger menu is open
  }
}

@media screen and (min-width: $AwakningBreakpointDesktop) {
  .site-content {
    overflow: visible;
  }
}
</style>
