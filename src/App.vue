<script setup lang="ts">
import { onMounted, onUnmounted, ref, provide, type Ref } from "vue";
import { RouterView } from "vue-router";
import SiteHeader from "./components/SiteHeader.vue";
import BurgerMenu from "./components/BurgerMenu.vue";

// Site Menu Items - Get Data & Send it to components
import type { SiteMenuItem } from "./data/menus";
import { useFetch } from "./composables/fetch";
import { siteMenuItemsUrl } from "./data/menus";
import {
  siteMenuItemsKey,
  toggleBurgerMenuKey,
  isBurgerMenuOpenKey,
} from "./utils/injectionkeys";

const siteMenuItems: Ref<SiteMenuItem[] | undefined> = ref([]);

/**
 * Send Menu Items List to both SiteNav and BurgerMenu components
 */
provide(siteMenuItemsKey, siteMenuItems);

onMounted(async () => {
  siteMenuItems.value = await useFetch(siteMenuItemsUrl);
});
// end Site Menu Items - Get Data & Send it to components

// Burger Menu - Open/Close Logic & Send handler and status
import SASSCONSTANTS from "@/assets/styles/_constants.module.scss"; /* Get the SASS Constants to use it in Javascript */
import { addResizeListener, removeResizeListener } from "@/composables/event";

const DESKTOPMINWIDTH: number = Number(
  SASSCONSTANTS.AwakningMediaQueryDesktopMinWidth.slice(0, -2)
); /* Get the minimal desktop width defined in SASS */
const isBurgerMenuOpen: Ref<Boolean> = ref(false);

function toggleBurgerMenu() {
  isBurgerMenuOpen.value = !isBurgerMenuOpen.value;
}

function closeBurgerMenuOnDesktop() {
  if (
    document.documentElement.clientWidth >= DESKTOPMINWIDTH &&
    isBurgerMenuOpen.value !== false
  ) {
    isBurgerMenuOpen.value = false;
  }
}

provide(toggleBurgerMenuKey, toggleBurgerMenu); // Send the open/close burger menu handle function to BurgerMenuLink component
provide(isBurgerMenuOpenKey, isBurgerMenuOpen); // Send the open/close burger menu status to SiteHeader component to toggle the burger menu icon

onMounted(() => {
  /**
   * Addition of an Event Listener to close the Burger Menu when we resize the window width from mobile to desktop.
   * @param {EventListenerOrEventListenerObject} callback
   * @param {Window | HTMLElement} element
   */
  addResizeListener(closeBurgerMenuOnDesktop, window);
});

onUnmounted(() => {
  /**
   * Removing of the Event Listener intended to close the Burger Menu when we resize the window width from mobile to desktop.
   * @param {EventListenerOrEventListenerObject} callback
   * @param {Window | HTMLElement} element
   */
  removeResizeListener(closeBurgerMenuOnDesktop, window);
});
// end Burger Menu - Open/Close Logic & Send handler and status
</script>

<template>
  <div
    class="site-container"
    :class="{ 'site-container--burger-menu-opened': isBurgerMenuOpen }"
  >
    <BurgerMenu v-if="isBurgerMenuOpen" />
    <div
      class="site-content"
      :class="{ 'site-content--burger-menu-opened': isBurgerMenuOpen }"
    >
      <SiteHeader @toggle-burger-menu="toggleBurgerMenu" />
      <RouterView />
    </div>
  </div>
</template>

<style scoped lang="scss">
.site-container--burger-menu-opened {
  display: flex;
}
.site-content--burger-menu-opened {
  flex: 1;
  overflow: hidden;
}
</style>
