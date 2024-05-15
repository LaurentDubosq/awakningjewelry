/** This component allows us to manage the Burger Menu Links and the Burger Menu
Dropdown Title & Links */

<script setup lang="ts">
import { toggleBurgerMenuKey } from "@/utils/injectionkeys";
import { inject } from "vue";
import { RouterLink } from "vue-router";

const toggleBurgerMenu: Function | undefined = inject(toggleBurgerMenuKey);

const { url, behavior } = defineProps({
  behavior: { type: String, required: true },
  url: { type: String, required: true },
});
</script>

<template>
  <template v-if="behavior === 'noLink'">
    <span class="burger-menu__link">
      <slot />
    </span>
  </template>
  <template v-else-if="behavior === 'link'">
    <RouterLink :to="url" class="burger-menu__link" @click="toggleBurgerMenu">
      <slot />
    </RouterLink>
  </template>
</template>

<style lang="scss">
@use "@/assets/styles/_constants.scss" as *;

/* The current style tag is unscoped to allow BurgerMenuDropdownHeader and BurgerMenuDropdownList to use the "burger-menu__link" CSS class */
.burger-menu__link {
  display: block;
  padding: 15px;
  font-size: 1.375rem;
  color: $AwakningColorWhite;
}
</style>
