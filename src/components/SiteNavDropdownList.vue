<script setup lang="ts">
import type { SiteMenuDropdownSubMenu } from '@/types/components'
import SiteNavDropdownItem from './SiteNavDropdownItem.vue'

const { links, dropdownText } = defineProps<{
  links: SiteMenuDropdownSubMenu
  dropdownText: string
}>()
</script>

<template>
  <ul
    class="site-nav__dropdown-list"
    :id="`site-nav__dropdown-list-${dropdownText.toLowerCase()}`"
    :aria-labelledby="`site-nav__dropdown-button-${dropdownText.toLowerCase()}`"
    data-testid="site-nav__dropdown-list"
  >
    <SiteNavDropdownItem :link v-for="link in links" />
  </ul>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants.scss' as *;

.site-nav__dropdown-list {
  position: absolute;
  min-width: 100%; // Allows width to match content minimum and container minimum at the same time
  padding: 10px 0;
  background: $AwakningColorSecondary;
  box-shadow: $AwakningBoxShadow;
  font-style: italic;
}
</style>
