<script setup lang="ts">
import type { SiteSubMenuItem } from '@/types/components'
import { toggleBurgerMenuKey } from '@/utils/injectionkeys'
import { inject, type PropType } from 'vue'

const { link } = defineProps({
  link: { type: Object as PropType<SiteSubMenuItem>, required: true },
})

const toggleBurgerMenu: (() => void) | undefined = inject(toggleBurgerMenuKey)
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
