<script setup lang="ts">
import { nextTick } from 'vue'
import { useFocusElement } from '@/composables/useFocusElement'
import SiteHeaderIcon from './SiteHeaderIcon.vue'
import IconBurger from './icons/IconBurger.vue'
import IconCross from './icons/IconCross.vue'
import { useIsBurgerMenuOpen } from '@/stores/isBurgerMenuOpen'
import { storeToRefs } from 'pinia'

// Get the stores instances
const isBurgerMenuOpenStore = useIsBurgerMenuOpen()

// Get the store's states and computeds
const { isBurgerMenuOpen } = storeToRefs(isBurgerMenuOpenStore)
const { toggleBurgerMenu } = isBurgerMenuOpenStore

async function handleClick(event: MouseEvent | KeyboardEvent) {
  // When the keyboard has generated the event
  if (event.detail === 0) {
    // Toggle the burger menu
    if (toggleBurgerMenu) {
      toggleBurgerMenu()
    }

    /* Focus the first item on burger menu opening */
    if (isBurgerMenuOpen && isBurgerMenuOpen.value) {
      // Wait after the burger menu has been opened
      await nextTick()

      // Find the first item
      const item = document.querySelector("[data-testid='burger-menu__item']") as HTMLElement | null

      // Focus the item
      useFocusElement(item)
    }
  }

  // When the mouse has generated the event
  if (event.detail === 1) {
    if (toggleBurgerMenu) {
      toggleBurgerMenu()
    }
  }
}
</script>

<template>
  <button
    @click="handleClick"
    aria-label="Open/Close the burger menu"
    :aria-pressed="isBurgerMenuOpen ? true : false"
    :aria-expanded="isBurgerMenuOpen ? true : false"
    aria-controls="burger-menu"
    data-testid="site-header__burger-menu-toggle"
  >
    <SiteHeaderIcon alternativeText="Close burger menu" v-if="isBurgerMenuOpen">
      <IconCross class="burger-menu-toggle__icon" width="27" aria-hidden="true" />
    </SiteHeaderIcon>
    <SiteHeaderIcon alternativeText="Open burger menu" v-else>
      <IconBurger class="burger-menu-toggle__icon" width="27" aria-hidden="true" />
    </SiteHeaderIcon>
  </button>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants.scss' as *;

.burger-menu-toggle__icon {
  fill: $AwakningColorPrimary;
}
</style>
