<script setup lang="ts">
import type { SiteMenuDropdown, SiteMenuLink } from '@/types/features'
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
const isLink = (siteMenuItem: SiteMenuLink | SiteMenuDropdown): siteMenuItem is SiteMenuLink => {
  return ['textLink', 'iconLink'].includes(siteMenuItem.type)
}
const isAccountLink = (siteMenuItem: SiteMenuLink | SiteMenuDropdown): boolean => {
  if (isLink(siteMenuItem)) {
    return siteMenuItem.name === 'account'
  }
  return false
}
const isDropdown = (
  siteMenuItem: SiteMenuLink | SiteMenuDropdown,
): siteMenuItem is SiteMenuLink => {
  return siteMenuItem.type === 'dropdown'
}
</script>

<template>
  <nav class="site-nav" aria-label="Site menu" data-testid="site-nav">
    <template v-if="siteMenuFetchState === 'fulfilled'">
      <ul class="site-nav__list">
        <li class="site-nav__item" data-testid="site-nav__item" v-for="siteMenuItem in siteMenu">
          <SiteNavLink :link="siteMenuItem" v-if="isLink(siteMenuItem)">
            <IconPerson
              class="site-nav__item-icon"
              width="27"
              aria-hidden="true"
              v-if="isAccountLink(siteMenuItem)"
            />
          </SiteNavLink>
          <SiteNavDropdown :dropdown="siteMenuItem" v-else-if="isDropdown(siteMenuItem)" />
        </li>
      </ul>
    </template>
    <LoadingComponent v-else-if="siteMenuFetchState === 'pending'" />
    <ErrorComponent v-else-if="siteMenuFetchState === 'rejected'" />
  </nav>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants' as *;

.site-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 551px;

  &__list {
    display: flex;
    align-items: center;
  }

  &__item {
    position: relative;
  }

  &__item-icon {
    fill: $AwakningColorPrimary;
  }
}
</style>
