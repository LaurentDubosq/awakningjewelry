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
import { nextTick, onMounted, onUnmounted, ref, watch, type Ref } from 'vue'
import { useFocusTrap } from '@/composables/useFocus'

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

/* Touching/clicking outside logic */
function handleClickOutside(event: TouchEvent | MouseEvent) {
  // Close the dropdown if the touched/clicked element is outside the burger menu
  if (!rootElement.value?.contains(event.target as Node)) {
    // Close the dropdown
    toggleBurgerMenu()
  }
}
watch(isBurgerMenuOpen, () => {
  if (isBurgerMenuOpen.value) {
    document.addEventListener('click', handleClickOutside)
  } else {
    document.removeEventListener('click', handleClickOutside)
  }
})

// A11y handlers
const handleKeydownEscape = async () => {
  // Close the burger menu
  toggleBurgerMenu()

  /* Focus back the toggle burger menu button */

  // Wait after the burger menu has been closed
  await nextTick()

  // Find the toggle burger menu first item
  const item = document.querySelector(
    "[data-testid='burger-menu-toggle-button']",
  ) as HTMLElement | null

  // Focus its focusable element
  item?.focus()
}

/* A11y focus trap */
let UseFocusTrapRemoveListener: () => void

onMounted(() => {
  watch(siteMenu, async () => {
    // Continue if site menu has been downloaded
    if (!siteMenu.value) return

    // Wait after the DOM update
    await nextTick()

    // Enable focus trap
    if (rootElement.value) {
      UseFocusTrapRemoveListener = useFocusTrap(rootElement.value)
    }
  })
})

onUnmounted(() => {
  UseFocusTrapRemoveListener?.()
})
</script>

<template>
  <nav
    ref="rootElement"
    class="burger-menu"
    @keydown.escape="handleKeydownEscape"
    aria-label="Site menu"
    id="burger-menu"
    data-testid="burger-menu"
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
