<script setup lang="ts">
import {
  ref,
  onMounted,
  inject,
  type Ref,
  onUnmounted,
  defineAsyncComponent,
} from "vue";
import { useGetElementClientWidth } from "@/composables/element";
import { isBurgerMenuOpenKey } from "@/utils/injectionkeys";
import { useIsOnMobileKey } from "@/utils/injectionkeys";
import BurgerIcon from "./icons/IconBurger.vue";
import CrossIcon from "./icons/IconCross.vue";
import PersonIcon from "./icons/IconPerson.vue";
import CartIcon from "./icons/IconCart.vue";
import SiteHeaderIcon from "./SiteHeaderIcon.vue";
import SiteLogo from "./SiteLogo.vue";
const SiteNav = defineAsyncComponent(() => import("./SiteNav.vue"));

// Get the current display platform
const useIsOnMobile: Ref<boolean> | undefined = inject(useIsOnMobileKey);
// end Get the current display platform

// Burger Icon Logic - Get the Burger Menu Status and display the appropriate icon
const isBurgerMenuOpen: Ref<boolean> | undefined = inject(isBurgerMenuOpenKey);
// end Burger Icon Logic

// Right Container Element - Get the width of the element to apply it to the burger menu icon container and perfectly align the logo in the middle.
const rightContainerElement: Ref<HTMLDivElement | null> = ref(null);
const rightContainerElementWidth: Ref<number> = ref(0);

function resizeBurgerMenuIconWrapperWidth() {
  if (rightContainerElement.value) {
    rightContainerElementWidth.value = useGetElementClientWidth(
      rightContainerElement.value
    );
  }
}

onMounted(() => {
  resizeBurgerMenuIconWrapperWidth();
  window.addEventListener("resize", resizeBurgerMenuIconWrapperWidth); // Recalculate the burger menu icon wrapper width when switching from desktop to mobile to center properly the website logo
});

onUnmounted(() => {
  window.removeEventListener("resize", resizeBurgerMenuIconWrapperWidth);
});
// end Right Container Element
</script>

<template>
  <header class="site-header">
    <div class="wrapper">
      <div class="site-header-inner">
        <div
          class="site-header__burger-menu-icon-wrapper"
          data-testid="site-header__burger-menu-icon-wrapper"
          :style="{ 'flex-basis': rightContainerElementWidth + 'px' }"
          v-if="useIsOnMobile"
        >
          <button
            type="button"
            @click="$emit('toggle-burger-menu')"
            data-testid="site-header__burger-menu-icon-button"
          >
            <SiteHeaderIcon>
              <CrossIcon width="32" v-if="isBurgerMenuOpen" />
              <BurgerIcon v-else />
            </SiteHeaderIcon>
          </button>
        </div>
        <div class="site-header__logo-wrapper">
          <RouterLink to="/" data-testid="site-header__logo-link">
            <SiteLogo />
          </RouterLink>
        </div>
        <div class="site-header__right-container" ref="rightContainerElement">
          <div
            class="site-header__site-nav-wrapper"
            data-testid="site-header__site-nav-wrapper"
            v-if="!useIsOnMobile"
          >
            <SiteNav />
          </div>
          <div
            class="site-header__account-icon-wrapper"
            data-testid="site-header__account-icon-wrapper"
            v-if="useIsOnMobile"
          >
            <RouterLink
              to="/account"
              data-testid="site-header__account-icon-link"
            >
              <SiteHeaderIcon>
                <PersonIcon />
              </SiteHeaderIcon>
            </RouterLink>
          </div>
          <div
            class="site-header__cart-icon-wrapper"
            data-testid="site-header__cart-icon-wrapper"
          >
            <RouterLink to="/cart" data-testid="site-header__cart-icon-link">
              <SiteHeaderIcon>
                <CartIcon />
              </SiteHeaderIcon>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
@use "@/assets/styles/_constants" as *;

.site-header {
  @media screen and (min-width: $AwakningBreakpointDesktop) {
    position: absolute;
    z-index: 1;
    width: 100%;
  }

  &-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 7px;
  }

  &__burger-menu-icon-wrapper {
    margin-left: -15px;
  }

  &__right-container {
    display: flex;
    justify-content: flex-end;
    margin-right: -15px;
  }
}
</style>
