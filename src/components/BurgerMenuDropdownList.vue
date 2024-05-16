<script setup lang="ts">
import type { SiteSubMenuItem } from "@/data/menus";
import { toggleBurgerMenuKey } from "@/utils/injectionkeys";
import { inject, type PropType } from "vue";
import { RouterLink } from "vue-router";

const toggleBurgerMenu: Function | undefined = inject(toggleBurgerMenuKey);

const { list } = defineProps({
  list: { type: Object as PropType<SiteSubMenuItem[]>, required: true },
});
</script>

<template>
  <div class="burger-menu__dropdown-list-wrapper">
    <menu class="burger-menu__dropdown-list transition">
      <li class="burger-menu__dropdown-list-item" v-for="item in list">
        <RouterLink
          :to="item.url"
          class="burger-menu__dropdown-list-item-link burger-menu__link"
          @click="toggleBurgerMenu"
        >
          {{ item.title }}
        </RouterLink>
      </li>
    </menu>
  </div>
</template>

<style scoped lang="scss">
.burger-menu__dropdown-list-wrapper {
  overflow: hidden; // Necessary for the transition
}
.burger-menu__dropdown-list-item-link {
  padding-left: 30px;
}
</style>
