<script setup lang="ts">
import type { SiteMenuDropdown, SiteMenuLink } from '@/types/components'
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
const { siteMenu, siteMenuFetchState } = storeToRefs(siteMenuStore)
const { toggleBurgerMenu } = isBurgerMenuOpenStore

// Utilities
function isLink(siteMenuItem: SiteMenuLink | SiteMenuDropdown): siteMenuItem is SiteMenuLink {
  return ['textLink', 'iconLink'].includes(siteMenuItem.type)
}
function isDropdown(
  siteMenuItem: SiteMenuLink | SiteMenuDropdown,
): siteMenuItem is SiteMenuDropdown {
  return siteMenuItem.type === 'dropdown'
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
      <LoadingComponent v-if="siteMenuFetchState === 'pending'" />
      <ErrorComponent v-if="siteMenuFetchState === 'rejected'" />
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
