<script setup lang="ts">
import type { SiteMenuItem } from '@/types/components'
import type { UseFetchWithStateReturn } from '@/types/fetch'
import type { FetchStatus } from '@/types/fetch'
import { type PropType, type ComputedRef, computed } from 'vue'
import BurgerMenuLink from './BurgerMenuLink.vue'
import BurgerMenuDropdown from './BurgerMenuDropdown.vue'
import LoadingComponent from './LoadingComponent.vue'
import ErrorComponent from './ErrorComponent.vue'

const { siteMenuResult } = defineProps({
  siteMenuResult: {
    type: Object as PropType<UseFetchWithStateReturn<SiteMenuItem[]>>,
    required: true,
  },
})

const siteMenuData: ComputedRef<SiteMenuItem[] | undefined> = computed(
  () => siteMenuResult.data?.value,
)

const siteMenuFetchStatus: ComputedRef<FetchStatus | undefined> = computed(
  () => siteMenuResult?.status?.value,
)

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
      <template v-if="siteMenuFetchStatus === 'resolved'">
        <li
          class="burger-menu__item"
          data-testid="burger-menu__item"
          v-for="siteMenuItem of siteMenuData"
        >
          <BurgerMenuLink :link="siteMenuItem" v-if="isLink(siteMenuItem)" />
          <BurgerMenuDropdown :dropdown="siteMenuItem" v-else-if="isDropdown(siteMenuItem)" />
        </li>
      </template>
      <LoadingComponent v-if="siteMenuFetchStatus === 'pending'" />
      <ErrorComponent v-if="siteMenuFetchStatus === 'rejected'" />
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
