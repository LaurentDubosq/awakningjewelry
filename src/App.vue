<script setup lang="ts">
import type { siteMenuItem } from "./data/menus";
import { onMounted, ref, provide } from "vue";
import { siteMenuItemsUrl } from "./data/menus";
import { useFetch } from "./composables/fetch";
import { RouterView } from "vue-router";
import SiteHeader from "./components/SiteHeader.vue";

const siteMenuItems = ref<siteMenuItem[]>([]);

provide("siteMenuItems", siteMenuItems);

onMounted(async () => {
  siteMenuItems.value = (await useFetch(siteMenuItemsUrl)) as siteMenuItem[];
});
</script>

<template>
  <SiteHeader @toggle-burger-menu="console.log('toggle burger menu')" />
  <RouterView />
</template>

<style scoped></style>
