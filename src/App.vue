<script setup lang="ts">
import { RouterView } from 'vue-router'
import SiteHeader from './components/SiteHeader.vue'
import BurgerMenu from './components/BurgerMenu.vue'
import MyTransition from './components/MyTransition.vue'
import { useIsBurgerMenuOpenStore } from './stores/isBurgerMenuOpen'
import { storeToRefs } from 'pinia'

// Get the stores instances
const isBurgerMenuOpenStore = useIsBurgerMenuOpenStore()

// Get the store's states and computeds
const { isBurgerMenuOpen } = storeToRefs(isBurgerMenuOpenStore)
</script>

<template>
  <div class="site-container">
    <MyTransition name="horizontal-left-slide" :group="false">
      <BurgerMenu v-show="isBurgerMenuOpen" />
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
    min-width: $BreakpointMobileMinWidth; // Allow the content to be overflowing on mobile when burger menu is open
  }
}

@media screen and (min-width: $breakpointDesktop) {
  .site-content {
    overflow: visible;
  }
}
</style>
