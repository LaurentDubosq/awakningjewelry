<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useIsOnMobileStore } from '@/stores/isOnMobile'
import { storeToRefs } from 'pinia'
import BurgerMenuToggle from './BurgerMenuToggle.vue'
import SiteLogo from './SiteLogo.vue'
import SiteHeaderIcon from './SiteHeaderIcon.vue'
import IconPerson from './icons/IconPerson.vue'
import IconCart from './icons/IconCart.vue'
import useGetAsyncComponent from '@/composables/useGetAsyncComponent'
const SiteNav = defineAsyncComponent(useGetAsyncComponent('SiteNav')) // Async import because mobile environment doesn't need the siteNav

/* Get the current display platform (mobile/desktop) to condition the asynchronous component imports. It also provides a more
readable code and the possibility of testing the renders according to environments */
const isOnMobileStore = useIsOnMobileStore()
const { isOnMobile } = storeToRefs(isOnMobileStore)
</script>

<template>
  <header class="site-header" role="banner">
    <div class="wrapper">
      <div class="site-header-inner">
        <div
          class="site-header__left-container"
          data-testid="site-header__left-container"
          v-if="isOnMobile"
        >
          <BurgerMenuToggle />
        </div>
        <div class="site-header__center-container">
          <RouterLink
            class="site-header__logo-link"
            to="/"
            title="Return to homepage"
            data-testid="site-header__logo-link"
          >
            <SiteLogo />
          </RouterLink>
        </div>
        <div class="site-header__right-container">
          <SiteNav v-if="!isOnMobile" />
          <RouterLink
            to="/account"
            title="Go to my account"
            data-testid="site-header__account-link"
            v-if="isOnMobile"
          >
            <SiteHeaderIcon alternativeText="Account">
              <IconPerson class="site-header__icon" width="27" aria-hidden="true" />
            </SiteHeaderIcon>
          </RouterLink>
          <RouterLink to="/cart" title="Go to cart" data-testid="site-header__cart-link">
            <SiteHeaderIcon alternativeText="Cart">
              <IconCart class="site-header__icon" width="27" aria-hidden="true" />
            </SiteHeaderIcon>
          </RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants' as *;

.site-header {
  &-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 7px;
  }

  &__logo-link {
    display: inline-block;
  }

  &__left-container {
    flex-grow: 1;
    flex-basis: 0;
    margin-left: -15px;
  }

  &__right-container {
    flex-grow: 1;
    flex-basis: 0;
    display: flex;
    justify-content: flex-end;
    margin-right: -15px;
  }

  &__icon {
    fill: $AwakningColorPrimary;
  }
}
</style>
