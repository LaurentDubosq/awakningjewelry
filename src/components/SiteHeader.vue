<script setup lang="ts">
import { ref, onMounted, inject, type Ref, onUnmounted } from "vue";
import { useGetElementClientWidth } from "@/composables/element";
import { isBurgerMenuOpenKey } from "@/utils/injectionkeys";
import SiteNav from "./SiteNav.vue";
import BurgerIcon from "./icons/IconBurger.vue";
import CrossIcon from "./icons/IconCross.vue";
import PersonIcon from "./icons/IconPerson.vue";
import CartIcon from "./icons/IconCart.vue";
import SiteHeaderIcon from "./SiteHeaderIcon.vue";
import SiteLogo from "./SiteLogo.vue";
import { addResizeListener, removeResizeListener } from "@/composables/event";

// Burger Icon Logic - Get the Burger Menu Status and display the appropriate icon
const isBurgerMenuOpen: Ref<Boolean> | undefined = inject(isBurgerMenuOpenKey);
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
  /**
   * Addition of an Event Listener to recalculate the burger menu icon wrapper width when switching tablet orientation from desktop to mobile
   * @param {EventListenerOrEventListenerObject} callback
   * @param {Window | HTMLElement} element
   */
  addResizeListener(resizeBurgerMenuIconWrapperWidth, window);
});
onUnmounted(() => {
  /**
   * Addition of an Event Listener to recalculate the burger menu icon wrapper width when switching tablet orientation from desktop to mobile
   * @param {EventListenerOrEventListenerObject} callback
   * @param {Window | HTMLElement} element
   */
  removeResizeListener(resizeBurgerMenuIconWrapperWidth, window);
});
// end Right Container Element
</script>

<template>
  <div class="wrapper">
    <header class="site-header">
      <div
        class="site-header__burger-menu-icon-wrapper hidden-desktop"
        :style="{ 'flex-basis': rightContainerElementWidth + 'px' }"
      >
        <SiteHeaderIcon
          behavior="button"
          url=""
          @click="$emit('toggle-burger-menu')"
        >
          <CrossIcon width="32" v-if="isBurgerMenuOpen" />
          <BurgerIcon v-else />
        </SiteHeaderIcon>
      </div>
      <div class="site-header__logo-wrapper">
        <SiteLogo />
      </div>
      <div class="site-header__right-container" ref="rightContainerElement">
        <div class="site-header__site-nav-wrapper hidden-mobile">
          <SiteNav />
        </div>
        <div class="site-header__account-icon-wrapper hidden-desktop">
          <SiteHeaderIcon behavior="link" url="/account">
            <PersonIcon />
          </SiteHeaderIcon>
        </div>
        <div class="site-header__cart-icon-wrapper">
          <SiteHeaderIcon behavior="link" url="/cart">
            <CartIcon />
          </SiteHeaderIcon>
        </div>
      </div>
    </header>
  </div>
</template>

<style scoped lang="scss">
.site-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 7px;

  &__logo-wrapper {
    flex-shrink: 0;
  }

  &__right-container {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
