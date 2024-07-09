<script setup lang="ts">
import { onMounted, onUnmounted, ref, provide, type Ref } from "vue";
import { RouterView } from "vue-router";
import SiteHeader from "./components/SiteHeader.vue";
import BurgerMenu from "./components/BurgerMenu.vue";
import MyTransition from "./components/MyTransition.vue";

// Site Menu Items - Get Data & Send it to SiteNav component
import type { SiteMenuItem } from "./data/menus";
import { getSiteMenuItems } from "./composables/fetch";
import { siteMenuItemsKey } from "./utils/injectionkeys";

const siteMenuItems: Ref<SiteMenuItem[] | undefined> = ref([]);

provide(siteMenuItemsKey, siteMenuItems); // Send Menu Items List to SiteNav component

onMounted(async () => {
  siteMenuItems.value = await getSiteMenuItems();
});
// end Site Menu Items - Get Data & Send it to component

// Burger Menu - Open/Close Logic & Send handler and status
import SASSCONSTANTS from "@/assets/styles/_constants.module.scss"; /* Get the SASS Constants to use it in Javascript */
import { addResizeListener, removeResizeListener } from "@/composables/event";
import {
  toggleBurgerMenuKey,
  isBurgerMenuOpenKey,
} from "./utils/injectionkeys";

const DESKTOPMINWIDTH: number = Number(
  SASSCONSTANTS.AwakningMediaQueryDesktopMinWidth.slice(0, -2)
); // Get the minimal desktop width defined in SASS
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

provide(toggleBurgerMenuKey, toggleBurgerMenu); // Send the open/close burger menu handle function to BurgerMenuDropdownList component
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
  <div class="site-container">
    <MyTransition name="marginLeftMinus300px">
      <BurgerMenu
        :siteMenuItems
        @toggle-burger-menu="toggleBurgerMenu"
        v-if="isBurgerMenuOpen"
      />
    </MyTransition>
    <div class="site-content">
      <SiteHeader @toggle-burger-menu="toggleBurgerMenu" />
      <RouterView />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/_constants.scss" as *;

@media screen and (max-width: $AwakningMediaQueryMobileMaxWidth) {
  .site-container {
    display: flex;
  }
  .site-content {
    flex: 1;
    overflow: hidden;
  }
}
</style>
