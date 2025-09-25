<!-- This component has attached documentation. This concerns burger menu closing. Find it at docs/features/BurgerMenu.md -->

<script setup lang="ts">
import type { SiteMenuDropdown, SiteMenuLink } from '@/types/features'
import BurgerMenuLink from './BurgerMenuLink.vue'
import BurgerMenuDropdown from './BurgerMenuDropdown.vue'
import LoadingComponent from './LoadingComponent.vue'
import ErrorComponent from './ErrorComponent.vue'
import { useSiteMenuStore } from '@/stores/siteMenu'
import { useIsBurgerMenuOpenStore } from '@/stores/isBurgerMenuOpen'
import { storeToRefs } from 'pinia'
import { ref, watch, type Ref } from 'vue'

const rootElement: Ref<HTMLElementTagNameMap['nav'] | null> = ref(null)

// Get the stores instances
const siteMenuStore = useSiteMenuStore()
const isBurgerMenuOpenStore = useIsBurgerMenuOpenStore()

// Get the store's states and computeds
const { siteMenu, siteMenuFetchState } = storeToRefs(siteMenuStore)
const { isBurgerMenuOpen } = storeToRefs(isBurgerMenuOpenStore)
const { toggleBurgerMenu } = isBurgerMenuOpenStore

// Utilities
const isLink = (siteMenuItem: SiteMenuLink | SiteMenuDropdown): siteMenuItem is SiteMenuLink => {
  return ['textLink', 'iconLink'].includes(siteMenuItem.type)
}
const isDropdown = (
  siteMenuItem: SiteMenuLink | SiteMenuDropdown,
): siteMenuItem is SiteMenuDropdown => {
  return siteMenuItem.type === 'dropdown'
}

/* Close the dropdown when touching outside */
function handleTouchOutside(event: TouchEvent) {
  // Close the dropdown if the touched element is outside the burger menu
  if (!rootElement.value?.contains(event.target as Node)) {
    // Prevent ghost/phantom clicks triggered after touch
    // More information in BurgerMenu.md (documentation)
    event.preventDefault()

    // Close the dropdown
    toggleBurgerMenu()
  }
}
watch(isBurgerMenuOpen, () => {
  if (isBurgerMenuOpen.value) {
    document.addEventListener('touchend', handleTouchOutside)
  } else {
    document.removeEventListener('touchend', handleTouchOutside)
  }
})
</script>

<template>
  <nav
    ref="rootElement"
    class="burger-menu"
    @keydown.escape="toggleBurgerMenu"
    aria-label="Site menu"
    id="burger-menu"
  >
    <ul class="burger-menu__list">
      <template v-if="siteMenuFetchState === 'fulfilled'">
        <li
          class="burger-menu__item"
          data-testid="burger-menu__item"
          v-for="siteMenuItem of siteMenu"
        >
          <BurgerMenuLink :link="siteMenuItem" v-if="isLink(siteMenuItem)" />
          <BurgerMenuDropdown :dropdown="siteMenuItem" v-else-if="isDropdown(siteMenuItem)" />
        </li>
      </template>
      <LoadingComponent v-else-if="siteMenuFetchState === 'pending'" />
      <ErrorComponent v-else-if="siteMenuFetchState === 'rejected'" />
    </ul>
  </nav>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants.scss' as *;

.burger-menu {
  flex: 0 1 300px;
  background-color: $AwakningColorPrimary;
  padding-top: 15px;
  height: 100vh;
  overflow: auto;
}
</style>
