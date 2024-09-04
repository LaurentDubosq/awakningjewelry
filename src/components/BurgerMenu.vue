<script setup lang="ts">
import type { SiteMenuItem } from "@/data/menus";
import { type PropType } from "vue";
import BurgerMenuItem from "./BurgerMenuItem.vue";
import BurgerMenuDropdown from "./BurgerMenuDropdown.vue";

const { siteMenuItems } = defineProps({
  siteMenuItems: { type: Array as PropType<SiteMenuItem[] | undefined> },
});
</script>

<template>
  <nav class="burger-menu">
    <menu class="burger-menu__list">
      <li
        class="burger-menu__list-item"
        data-testid="burger-menu__list-item"
        v-for="siteMenuItem of siteMenuItems"
      >
        <BurgerMenuDropdown
          :dropdown="siteMenuItem"
          v-if="siteMenuItem.subMenuItems"
        />
        <RouterLink
          :to="siteMenuItem.url"
          class="burger-menu__link"
          data-testid="burger-menu__link"
          @click="$emit('close-burger-menu')"
          v-else
        >
          <BurgerMenuItem>
            {{ siteMenuItem.title }}
          </BurgerMenuItem>
        </RouterLink>
      </li>
    </menu>
  </nav>
</template>

<style scoped lang="scss">
@use "@/assets/styles/_constants.scss" as *;

.burger-menu {
  flex: 0 1 300px;
  background-color: $AwakningColorBlack;
  padding-top: 15px;
  height: 100vh;
  overflow: auto;
}
</style>
