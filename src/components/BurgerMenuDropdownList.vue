<script setup lang="ts">
import type { SiteSubMenuItem } from "@/types/components";
import { type PropType } from "vue";
import BurgerMenuDropdownItem from "./BurgerMenuDropdownItem.vue";

const { links, dropdownText } = defineProps({
  links: { type: Object as PropType<SiteSubMenuItem[]>, required: true },
  dropdownText: { type: String, required: true },
});
</script>

<template>
  <div class="burger-menu__dropdown-list-wrapper">
    <ul
      class="burger-menu__dropdown-list transition"
      :id="`burger-menu__dropdown-list-${dropdownText.toLowerCase()}`"
      :aria-labelledby="`burger-menu__dropdown-button-${dropdownText.toLowerCase()}`"
      data-testid="burger-menu__dropdown-list"
    >
      <BurgerMenuDropdownItem :link v-for="link in links" />
    </ul>
  </div>
</template>

<style scoped lang="scss">
.burger-menu__dropdown-list-wrapper {
  overflow: hidden; // Necessary for the proper functioning of the transition
}
</style>
