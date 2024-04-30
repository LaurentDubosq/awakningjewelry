<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useElementClientWidth } from "@/composables/element";
import SiteNav from "./SiteNav.vue";
import BurgerMenuIcon from "./icons/IconBurger.vue";
import PersonIcon from "./icons/IconPerson.vue";
import CartIcon from "./icons/IconCart.vue";
import SiteHeaderIconAction from "./SiteHeaderIconAction.vue";
import SiteHeaderIconLink from "./SiteHeaderIconLink.vue";
import SiteLogo from "./SiteLogo.vue";

const rightContainerElement = ref(null);
const rightContainerElementWidth = ref(0);

onMounted(() => {
  if (rightContainerElement.value) {
    rightContainerElementWidth.value = useElementClientWidth(
      rightContainerElement.value
    );
  }
});
</script>

<template>
  <div class="wrapper">
    <header class="site-header">
      <div
        class="site-header__burger-menu-icon-wrapper hidden-desktop"
        :style="{ 'flex-basis': rightContainerElementWidth + 'px' }"
      >
        <SiteHeaderIconAction @click="$emit('toggle-burger-menu')">
          <BurgerMenuIcon />
        </SiteHeaderIconAction>
      </div>
      <div class="site-header__logo-wrapper no-shrink">
        <RouterLink to="/">
          <SiteLogo />
        </RouterLink>
      </div>
      <div class="site-header__right-container" ref="rightContainerElement">
        <div class="site-header__site-nav-wrapper hidden-mobile">
          <SiteNav />
        </div>
        <div class="site-header__account-icon-wrapper hidden-desktop">
          <SiteHeaderIconLink url="/account">
            <PersonIcon />
          </SiteHeaderIconLink>
        </div>
        <div class="site-header__cart-icon-wrapper">
          <SiteHeaderIconLink url="/cart">
            <CartIcon />
          </SiteHeaderIconLink>
        </div>
      </div>
    </header>
  </div>
</template>

<style lang="scss">
/* This "style" tag has been unscope to allow the availability of css properties both in SiteHeaderIconAction and SiteHeaderIconLink component */
@use "@/assets/styles/_constants.scss" as *;

.site-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 7px;

  &__icon-clickable-area {
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__icon-size {
    width: 27px;
  }

  &__logo {
    width: 81px;
  }

  &__right-container {
    display: flex;
    justify-content: flex-end;
  }
}

@media screen and (min-width: $desktop-min-width) {
  .site-header {
    &__logo--size-desktop {
      width: 115px;
    }
  }
}
</style>
