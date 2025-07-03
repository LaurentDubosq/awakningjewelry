<script setup lang="ts">
import { nextTick } from 'vue'
import { useFocusFirstFocusableChildElement } from '@/composables/useFocusFirstFocusableChildElement'
import SiteHeaderIcon from './SiteHeaderIcon.vue'
import IconBurger from './icons/IconBurger.vue'
import IconCross from './icons/IconCross.vue'
import { useIsBurgerMenuOpenStore } from '@/stores/isBurgerMenuOpen'
import { storeToRefs } from 'pinia'

// Get the stores instances
const isBurgerMenuOpenStore = useIsBurgerMenuOpenStore()

// Get the store's states and computeds
const { isBurgerMenuOpen } = storeToRefs(isBurgerMenuOpenStore)
const { toggleBurgerMenu } = isBurgerMenuOpenStore

async function handleClick(event: MouseEvent | KeyboardEvent) {
  // When the keyboard has generated the event
  if (event.detail === 0) {
    // Toggle the burger menu
    toggleBurgerMenu()

    /* Focus the first item on burger menu opening */
    if (isBurgerMenuOpen.value) {
      // Wait after the burger menu has been opened
      await nextTick()

      // Find the first item
      const item = document.querySelector("[data-testid='burger-menu__item']") as HTMLElement | null

      // Focus its focusable element
      if (item) {
        useFocusFirstFocusableChildElement(item)
      }
    }
  }

  // When the mouse has generated the event
  if (event.detail === 1) {
    toggleBurgerMenu()
  }
}
</script>

<template>
  <button
    class="burger-menu-toggle-button"
    @click="handleClick"
    :aria-expanded="isBurgerMenuOpen ? true : false"
    aria-controls="burger-menu"
    data-testid="burger-menu-toggle-button"
  >
    <SiteHeaderIcon :alternative-text="isBurgerMenuOpen ? 'Close burger menu' : 'Open burger menu'">
      <KeepAlive>
        <component
          class="burger-menu-toggle-button__icon"
          :is="isBurgerMenuOpen ? IconCross : IconBurger"
          width="27"
          aria-hidden="true"
        />
      </KeepAlive>
    </SiteHeaderIcon>
  </button>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants.scss' as *;

.burger-menu-toggle-button__icon {
  fill: $AwakningColorPrimary;
}
</style>
