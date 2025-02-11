<script setup lang="ts">
import type { SiteMenuItem } from '@/types/components'
import { inject, type PropType } from 'vue'
import { toggleBurgerMenuKey } from '@/utils/injectionkeys'

const { link } = defineProps({
  link: { type: Object as PropType<SiteMenuItem>, required: true },
})
const toggleBurgerMenu: Function | undefined = inject(toggleBurgerMenuKey)
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
  color: $AwakningColorWhite;
}
.burger-menu__link:focus-visible {
  outline-offset: -3px;
}
</style>
