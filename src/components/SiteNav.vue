<script setup lang="ts">
import type { SiteMenuItem } from '@/types/components'
import IconPerson from './icons/IconPerson.vue'
import SiteNavLink from './SiteNavLink.vue'
import SiteNavDropdown from './SiteNavDropdown.vue'
import LoadingComponent from './LoadingComponent.vue'
import ErrorComponent from './ErrorComponent.vue'
import { useSiteMenuStore } from '@/stores/siteMenu'
import { storeToRefs } from 'pinia'

// Get the store instance
const siteMenuStore = useSiteMenuStore()

// Get the store's computeds
const { siteMenuData, siteMenuResultFetchStatus } = storeToRefs(siteMenuStore)

// Utilities
function isLink(item: SiteMenuItem): boolean {
  return item.type === 'icon' || item.type === 'text'
}
function isDropdown(item: SiteMenuItem): boolean {
  return item.type === 'dropdown'
}
function isAccountLink(item: SiteMenuItem): boolean {
  return item.name === 'account'
}
</script>

<template>
  <nav class="site-nav" aria-label="Website's desktop navigation bar" data-testid="site-nav">
    <ul class="site-nav__list" aria-label="Website's desktop navigation bar">
      <template v-if="siteMenuResultFetchStatus === 'resolved'">
        <li class="site-nav__item" data-testid="site-nav__item" v-for="menuItem in siteMenuData">
          <SiteNavLink :link="menuItem" v-if="isLink(menuItem)">
            <IconPerson v-if="isAccountLink(menuItem)" width="27" aria-hidden="true" />
          </SiteNavLink>
          <SiteNavDropdown :dropdown="menuItem" v-else-if="isDropdown(menuItem)" />
        </li>
      </template>
      <LoadingComponent v-if="siteMenuResultFetchStatus === 'pending'" />
      <ErrorComponent v-if="siteMenuResultFetchStatus === 'rejected'" />
    </ul>
  </nav>
</template>

<style scoped lang="scss">
.site-nav__list {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.site-nav__item {
  position: relative;
}
</style>
