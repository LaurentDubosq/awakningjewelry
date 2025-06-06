<script setup lang="ts">
import type { SiteMenuItem } from '@/types/components'
import BurgerMenuLink from './BurgerMenuLink.vue'
import BurgerMenuDropdown from './BurgerMenuDropdown.vue'
import LoadingComponent from './LoadingComponent.vue'
import ErrorComponent from './ErrorComponent.vue'
import { useSiteMenuStore } from '@/stores/siteMenu'
import { useIsBurgerMenuOpenStore } from '@/stores/isBurgerMenuOpen'
import { storeToRefs } from 'pinia'

// Get the stores instances
const siteMenuStore = useSiteMenuStore()
const isBurgerMenuOpenStore = useIsBurgerMenuOpenStore()

// Get the store's states and computeds
const { siteMenuData, siteMenuResultFetchState } = storeToRefs(siteMenuStore)
const { toggleBurgerMenu } = isBurgerMenuOpenStore

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
    @keydown.escape="toggleBurgerMenu"
    aria-label="Website's mobile navigation burger menu"
    id="burger-menu"
  >
    <ul class="burger-menu__list">
      <template v-if="siteMenuResultFetchState === 'fulfilled'">
        <li
          class="burger-menu__item"
          data-testid="burger-menu__item"
          v-for="siteMenuItem of siteMenuData"
        >
          <BurgerMenuLink :link="siteMenuItem" v-if="isLink(siteMenuItem)" />
          <BurgerMenuDropdown :dropdown="siteMenuItem" v-else-if="isDropdown(siteMenuItem)" />
        </li>
      </template>
      <LoadingComponent v-if="siteMenuResultFetchState === 'pending'" />
      <ErrorComponent v-if="siteMenuResultFetchState === 'rejected'" />
    </ul>
  </nav>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants.scss' as *;

.burger-menu {
  flex: 0 1 300px;
  background-color: $AwakningPermanentColorBlack;
  padding-top: 15px;
  height: 100vh;
  overflow: auto;
}
</style>
