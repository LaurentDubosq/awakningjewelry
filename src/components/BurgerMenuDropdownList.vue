<script setup lang="ts">
import type { SiteSubMenuItem } from "@/data/menus";
import { toggleBurgerMenuKey } from "@/utils/injectionkeys";
import { inject, type PropType } from "vue";
import BurgerMenuDropdownItem from "./BurgerMenuDropdownItem.vue";

const toggleBurgerMenu: Function | undefined = inject(toggleBurgerMenuKey);

const { items } = defineProps({
  items: { type: Object as PropType<SiteSubMenuItem[]>, required: true },
});
</script>

<template>
  <div class="burger-menu__dropdown-list-wrapper">
    <menu class="burger-menu__dropdown-list transition">
      <li
        class="burger-menu__dropdown-list-item"
        data-testid="burger-menu__dropdown-list-item"
        v-for="item in items"
      >
        <RouterLink
          :to="item.url"
          @click="toggleBurgerMenu"
          data-testid="burger-menu__dropdown-list-item-link"
        >
          <BurgerMenuDropdownItem>
            {{ item.title }}
          </BurgerMenuDropdownItem>
        </RouterLink>
      </li>
    </menu>
  </div>
</template>

<style scoped lang="scss">
.burger-menu__dropdown-list-wrapper {
  overflow: hidden; // Necessary for the transition
}
.burger-menu__dropdown-list-item {
  padding-left: 30px;
}
</style>
