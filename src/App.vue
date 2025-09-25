<!-- This component has attached documentation. This concerns footer shift problem, unclickable area when the burger menu is open. Find it at docs/features/App.md -->

<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import SiteHeader from './components/SiteHeader.vue'
import BurgerMenu from './components/BurgerMenu.vue'
import MyTransition from './components/MyTransition.vue'
import { useIsBurgerMenuOpenStore } from './stores/isBurgerMenuOpen'
import { storeToRefs } from 'pinia'
import SiteFooter from './components/SiteFooter.vue'
import { ref, watch, type Ref } from 'vue'
import AnnouncementBar from './components/AnnouncementBar.vue'

/* Burger menu */

// Get the stores instances
const isBurgerMenuOpenStore = useIsBurgerMenuOpenStore()

// Get the store's states and computeds
const { isBurgerMenuOpen } = storeToRefs(isBurgerMenuOpenStore)

/* Footer (CLS logic) */
// More information in App.md (documentation)

const route = useRoute()
const minHeight: Ref<string | undefined> = ref()
const routes: Record<string, string> = { '/pages/about-us': 'auto' }

const getRouteMinHeight = (): string => {
  return routes[window.location.pathname] ?? '100vh'
}

watch(
  () => route.path,
  () => (minHeight.value = getRouteMinHeight()),
  { immediate: true },
)

/* Announcement bar */
const isAnnouncementBarDisplayed: Ref<boolean> = ref(true)
</script>

<template>
  <div class="site-container">
    <MyTransition name="horizontal-left-slide" :group="false">
      <BurgerMenu v-show="isBurgerMenuOpen" />
    </MyTransition>
    <div class="site-content" :style="{ 'pointer-events': isBurgerMenuOpen ? 'none' : undefined }">
      <div class="site-content-inner-container">
        <MyTransition name="vertical-top-slide" :group="false">
          <AnnouncementBar
            @close-announcement-bar="isAnnouncementBarDisplayed = false"
            v-if="isAnnouncementBarDisplayed"
          />
        </MyTransition>
        <SiteHeader class="site-header" />
        <main :style="{ 'min-height': minHeight }">
          <RouterView />
        </main>
        <SiteFooter />
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

  &-inner-container {
    min-width: $BreakpointMobileMinWidth; // Allow the content to be overflowing on mobile when burger menu is open
  }
}
.site-header {
  @media screen and (min-width: $breakpointDesktop) {
    position: relative;
    z-index: 1;
  }
}

@media screen and (min-width: $breakpointDesktop) {
  .site-content {
    overflow: visible;
  }
}
</style>
