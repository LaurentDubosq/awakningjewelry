<script setup lang="ts">
import type { SiteMenuDropdown, SiteMenuLink } from '@/types/components'
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
const { siteMenu, siteMenuFetchState } = storeToRefs(siteMenuStore)

// Utilities
function isLink(siteMenuItem: SiteMenuLink | SiteMenuDropdown): siteMenuItem is SiteMenuLink {
  return ['textLink', 'iconLink'].includes(siteMenuItem.type)
}
function isAccountLink(siteMenuItem: SiteMenuLink | SiteMenuDropdown): boolean {
  if (isLink(siteMenuItem)) {
    return siteMenuItem.name === 'account'
  }
  return false
}
function isDropdown(siteMenuItem: SiteMenuLink | SiteMenuDropdown): siteMenuItem is SiteMenuLink {
  return siteMenuItem.type === 'dropdown'
}
</script>

<template>
  <nav class="site-nav" aria-label="Website's desktop navigation bar" data-testid="site-nav">
    <ul class="site-nav__list" aria-label="Website's desktop navigation bar">
      <template v-if="siteMenuFetchState === 'fulfilled'">
        <li class="site-nav__item" data-testid="site-nav__item" v-for="siteMenuItem in siteMenu">
          <SiteNavLink :link="siteMenuItem" v-if="isLink(siteMenuItem)">
            <IconPerson
              class="site-nav__item-icon"
              v-if="isAccountLink(siteMenuItem)"
              width="27"
              aria-hidden="true"
            />
          </SiteNavLink>
          <SiteNavDropdown :dropdown="siteMenuItem" v-else-if="isDropdown(siteMenuItem)" />
        </li>
      </template>
      <LoadingComponent v-if="siteMenuFetchState === 'pending'" />
      <ErrorComponent v-if="siteMenuFetchState === 'rejected'" />
    </ul>
  </nav>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants' as *;

.site-nav__list {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.site-nav__item {
  position: relative;

  &-icon {
    fill: $AwakningColorPrimary;
  }
}
</style>
