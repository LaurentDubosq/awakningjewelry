<script setup lang="ts">
import { provide } from 'vue'
import { RouterView } from 'vue-router'
import SiteHeader from './components/SiteHeader.vue'
import BurgerMenu from './components/BurgerMenu.vue'
import MyTransition from './components/MyTransition.vue'
import { useIsBurgerMenuOpen } from './stores/isBurgerMenuOpen'
import { storeToRefs } from 'pinia'

// Get the stores instances
const isBurgerMenuOpenStore = useIsBurgerMenuOpen()

// Get the store's states and computeds
const { isBurgerMenuOpen } = storeToRefs(isBurgerMenuOpenStore)
const { toggleBurgerMenu } = isBurgerMenuOpenStore

/*************/
/* Site Menu */
/*************/

// Provide the site menu (to: SiteNav.vue)
import type { SiteMenuItem } from './types/components'
import { getSiteMenu } from './data/dataFetchers'
import { siteMenuKey } from './utils/injectionkeys'
import type { UseFetchWithStateReturn } from './types/fetch'

const siteMenuResult: UseFetchWithStateReturn<SiteMenuItem[]> = getSiteMenu()

provide(siteMenuKey, siteMenuResult)
</script>

<template>
  <div class="site-container">
    <MyTransition name="marginLeftMinus300px" :group="false">
      <BurgerMenu :siteMenuResult @close-burger-menu="toggleBurgerMenu" v-show="isBurgerMenuOpen" />
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
