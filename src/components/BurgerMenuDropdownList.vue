<script setup lang="ts">
import type { SiteSubMenuItem } from "@/data/menus";
import { inject, type Ref, type PropType } from "vue";
import BurgerMenuLink from "./BurgerMenuLink.vue";
import { RouterLink } from "vue-router";

const toggleBurgerMenu: Ref<Function> | undefined = inject("toggleBurgerMenu");

const { list } = defineProps({
  list: { type: Object as PropType<SiteSubMenuItem[]>, required: true },
});
</script>

<template>
  <menu class="burger-menu__dropdown-list">
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
</template>

<style scoped lang="scss">
.burger-menu__dropdown-list-item-link {
  padding-left: 30px;
}
</style>
