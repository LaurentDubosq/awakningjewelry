<script setup lang="ts">
import type { siteMenuItem } from "@/data/menus";
import { inject } from "vue";
import SiteNavListItem from "./SiteNavListItem.vue";

const siteMenuItems = inject<siteMenuItem[]>("siteMenuItems");
</script>

<template>
  <menu class="site-nav__list">
    <SiteNavListItem v-for="link in siteMenuItems" :link="link" />
  </menu>
</template>

<style scoped lang="scss">
.site-nav__list {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
