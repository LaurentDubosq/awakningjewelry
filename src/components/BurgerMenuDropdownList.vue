<script setup lang="ts">
import type { SiteMenuDropdownLink } from '@/types/components'
import BurgerMenuDropdownItem from './BurgerMenuDropdownItem.vue'

const { links, id } = defineProps<{
  links: SiteMenuDropdownLink[]
  id: string
}>()

const idLowered = id.toLowerCase()
</script>

<template>
  <div class="burger-menu__dropdown-list-wrapper">
    <ul
      class="burger-menu__dropdown-list transition"
      :id="`burger-menu__dropdown-list-${idLowered}`"
      data-testid="burger-menu__dropdown-list"
    >
      <BurgerMenuDropdownItem :link v-for="link in links" />
    </ul>
  </div>
</template>

<style scoped lang="scss">
.burger-menu__dropdown-list-wrapper {
  overflow: hidden; // necessary for the proper functioning of the transition
}
</style>
