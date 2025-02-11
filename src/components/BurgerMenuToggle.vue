<script setup lang="ts">
import { inject, nextTick, type Ref } from 'vue'
import { isBurgerMenuOpenKey, toggleBurgerMenuKey } from '@/utils/injectionkeys'
import { useFocusElement } from '@/composables/useFocusElement'
import SiteHeaderIcon from './SiteHeaderIcon.vue'
import IconBurger from './icons/IconBurger.vue'
import IconCross from './icons/IconCross.vue'

const isBurgerMenuOpen: Ref<boolean> | undefined = inject(isBurgerMenuOpenKey) // Get the burger menu open/close status
const toggleBurgerMenu: Function | undefined = inject(toggleBurgerMenuKey) // Get the burger menu toggle

async function handleClick(event: MouseEvent | KeyboardEvent) {
  // When the keyboard has generated the event
  if (event.detail === 0) {
    // Toggle the burger menu
    toggleBurgerMenu && toggleBurgerMenu()

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
    toggleBurgerMenu && toggleBurgerMenu()
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
      <IconCross width="27" aria-hidden="true" />
    </SiteHeaderIcon>
    <SiteHeaderIcon alternativeText="Open burger menu" v-else>
      <IconBurger width="27" aria-hidden="true" />
    </SiteHeaderIcon>
  </button>
</template>
