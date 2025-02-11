<script setup lang="ts">
import type { SiteSubMenuItem } from '@/types/components'
import { type PropType } from 'vue'
import SiteNavDropdownItem from './SiteNavDropdownItem.vue'

const { links, dropdownText } = defineProps({
  links: { type: Array as PropType<SiteSubMenuItem[]>, required: true },
  dropdownText: { type: String, required: true },
})
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
  background: $AwakningColorWhite;
  box-shadow: $AwakningBoxShadow;
  font-style: italic;
}
</style>
