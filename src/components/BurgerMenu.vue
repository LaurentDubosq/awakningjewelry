<script setup lang="ts">
import type { SiteMenuItem } from '@/types/components'
import BurgerMenuLink from './BurgerMenuLink.vue'
import BurgerMenuDropdown from './BurgerMenuDropdown.vue'
import LoadingComponent from './LoadingComponent.vue'
import ErrorComponent from './ErrorComponent.vue'
import { useSiteMenuStore } from '@/stores/siteMenu'
import { storeToRefs } from 'pinia'

// Get the store instance
const siteMenuStore = useSiteMenuStore()

// Get the store's computeds
const { siteMenuData, siteMenuResultFetchStatus } = storeToRefs(siteMenuStore)

// Utilities
function isLink(siteMenuItem: SiteMenuItem): boolean {
  return !siteMenuItem.subMenu
}
function isDropdown(siteMenuItem: SiteMenuItem): boolean {
  return !!siteMenuItem.subMenu
}
</script>

<template>
  <nav
    class="burger-menu"
    @keydown.escape="$emit('close-burger-menu')"
    aria-label="Website's mobile navigation burger menu"
    id="burger-menu"
  >
    <ul class="burger-menu__list">
      <template v-if="siteMenuResultFetchStatus === 'resolved'">
        <li
          class="burger-menu__item"
          data-testid="burger-menu__item"
          v-for="siteMenuItem of siteMenuData"
        >
          <BurgerMenuLink :link="siteMenuItem" v-if="isLink(siteMenuItem)" />
          <BurgerMenuDropdown :dropdown="siteMenuItem" v-else-if="isDropdown(siteMenuItem)" />
        </li>
      </template>
      <LoadingComponent v-if="siteMenuResultFetchStatus === 'pending'" />
      <ErrorComponent v-if="siteMenuResultFetchStatus === 'rejected'" />
    </ul>
  </nav>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants.scss' as *;

.burger-menu {
  flex: 0 1 300px;
  background-color: $AwakningColorBlack;
  padding-top: 15px;
  height: 100vh;
  overflow: auto;
}
</style>
