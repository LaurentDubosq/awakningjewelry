<script setup lang="ts">
import { useIsBurgerMenuOpenStore } from '@/stores/isBurgerMenuOpen'
import type { SiteMenuLink } from '@/types/features'

const { link } = defineProps<{
  link: SiteMenuLink
}>()

// Get the stores instances
const isBurgerMenuOpenStore = useIsBurgerMenuOpenStore()

// Get the store's states and computeds
const { toggleBurgerMenu } = isBurgerMenuOpenStore
</script>

<template>
  <RouterLink
    :to="link.url"
    class="burger-menu__link"
    @click="toggleBurgerMenu"
    data-testid="burger-menu__link"
  >
    {{ link.text }}
  </RouterLink>
</template>

<style lang="scss">
@use '@/assets/styles/_constants.scss' as *;

/* The current style tag is unscoped to allow BurgerMenuDropdownButton and BurgerMenuDropdownItem to use the "burger-menu__link" CSS class */
.burger-menu__link {
  display: block;
  padding: 15px;
  font-size: 1.375rem;
  color: $AwakningColorSecondary;
}
.burger-menu__link:focus-visible {
  outline-offset: -3px;
}
</style>
