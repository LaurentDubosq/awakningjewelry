<script setup lang="ts">
import type { SiteMenuDropdownLink } from '@/types/components'
import { closeDropdownKey } from '@/utils/injectionkeys'
import { inject } from 'vue'

const { link } = defineProps<{
  link: SiteMenuDropdownLink
}>()

const closeDropdown: (() => void) | undefined = inject(closeDropdownKey)
</script>

<template>
  <li class="site-nav__dropdown-item" data-testid="site-nav__dropdown-item">
    <RouterLink
      class="site-nav__dropdown-item-link"
      :to="link.url"
      :title="`Explore our ${link.text}`"
      @click="closeDropdown"
      data-testid="site-nav__dropdown-item-link"
      >{{ link.text }}</RouterLink
    >
  </li>
</template>

<style scoped lang="scss">
.site-nav__dropdown-item-link {
  display: block;
  padding: 10px 15px;
  white-space: nowrap;
  font-style: italic;
}
</style>
