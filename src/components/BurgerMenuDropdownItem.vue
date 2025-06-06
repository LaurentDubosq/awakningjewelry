<script setup lang="ts">
import { useIsBurgerMenuOpenStore } from '@/stores/isBurgerMenuOpen'
import type { SiteSubMenuItem } from '@/types/components'

const { link } = defineProps<{
  link: SiteSubMenuItem
}>()

// Get the stores instances
const isBurgerMenuOpenStore = useIsBurgerMenuOpenStore()

// Get the store's states and computeds
const { toggleBurgerMenu } = isBurgerMenuOpenStore
</script>

<template>
  <li class="burger-menu__dropdown-item" data-testid="burger-menu__dropdown-item">
    <RouterLink
      class="burger-menu__dropdown-item-link burger-menu__link"
      :to="link.url"
      @click="toggleBurgerMenu"
      data-testid="burger-menu__dropdown-item-link"
      >{{ link.text }}</RouterLink
    >
  </li>
</template>

<style scoped lang="scss">
.burger-menu__dropdown-item-link {
  padding-left: 30px;
}
</style>
