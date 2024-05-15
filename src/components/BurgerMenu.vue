<script setup lang="ts">
import type { SiteMenuItem } from "@/data/menus";
import { inject, type Ref } from "vue";
import BurgerMenuLink from "./BurgerMenuLink.vue";
import BurgerMenuDropdown from "./BurgerMenuDropdown.vue";

const siteMenuItems: Ref<SiteMenuItem[] | undefined> | undefined =
  inject("siteMenuItems");
</script>

<template>
  <nav class="burger-menu">
    <menu class="burger-menu__list">
      <li class="burger-menu__list-item" v-for="item of siteMenuItems">
        <BurgerMenuDropdown :item="item" v-if="item.subMenuItems" />
        <BurgerMenuLink behavior="link" :url="item.url" v-else>{{
          item.title
        }}</BurgerMenuLink>
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
