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
import {
  toggleBurgerMenuKey,
  isBurgerMenuOpenKey,
} from "./utils/injectionkeys";

const DESKTOPBREAKPOINT: number = Number(
  SASSCONSTANTS.AwakningBreakpointDesktop.slice(0, -2)
); // Get the desktop breakpoint defined in SASS
const isBurgerMenuOpen: Ref<boolean> = ref(false);

function toggleBurgerMenu() {
  isBurgerMenuOpen.value = !isBurgerMenuOpen.value;
}

function closeBurgerMenuOnDesktop() {
  if (
    document.documentElement.clientWidth >= DESKTOPBREAKPOINT &&
    isBurgerMenuOpen.value !== false
  ) {
    isBurgerMenuOpen.value = false;
  }
}

provide(toggleBurgerMenuKey, toggleBurgerMenu); // Send the open/close burger menu handle function to BurgerMenuDropdownList component
provide(isBurgerMenuOpenKey, isBurgerMenuOpen); // Send the open/close burger menu status to SiteHeader component to toggle the burger menu icon

onMounted(() => {
  window.addEventListener("resize", closeBurgerMenuOnDesktop); // Close the Burger Menu when we resize the window width from mobile to desktop.
});

onUnmounted(() => {
  window.removeEventListener("resize", closeBurgerMenuOnDesktop);
});
// end Burger Menu - Open/Close Logic & Send handler and status

// Global Variables
import { useIsOnMobile } from "./composables/display";
import { useIsOnMobileKey } from "./utils/injectionkeys";

provide(useIsOnMobileKey, useIsOnMobile()); // inform if we are on mobile or desktop environment
// end Global Variables
</script>

<template>
  <div class="site-container">
    <MyTransition name="marginLeftMinus300px">
      <BurgerMenu
        :siteMenuItems
        @close-burger-menu="toggleBurgerMenu"
        v-if="isBurgerMenuOpen"
      />
    </MyTransition>
    <div class="site-content">
      <div class="site-content-container">
        <SiteHeader @toggle-burger-menu="toggleBurgerMenu" />
        <main>
          <RouterView />
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/_constants.scss" as *;

.site-container {
  display: flex;
}
.site-content {
  flex: 1;
  overflow: hidden;

  &-container {
    min-width: $AwakningBreakpointMobileMinWidth; // Allow the content to be overflowing on mobile when burger menu is open
  }
}

@media screen and (min-width: $AwakningBreakpointDesktop) {
  .site-content {
    overflow: visible;
  }
}
</style>
