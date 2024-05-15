<script setup lang="ts">
import { pagesMetaData } from "@/router/index";
import type { PageMetaData } from "@/data/seo";
const homeMetaData: PageMetaData | undefined = pagesMetaData?.find(
  () => "home"
);
</script>

<template>
  <RouterLink to="/">
    <img
      src="@/assets/logo.svg"
      alt="AwakningJewelry's logo - Illustration of a person medidating above the AwakningJewelry brand name"
      :title="homeMetaData?.title"
      class="site-header__logo site-header__logo--size-desktop"
    />
  </RouterLink>
</template>

<style scoped lang="scss">
@use "@/assets/styles/_constants.scss" as *;

.site-header__logo {
  display: block;
  width: 81px;
}

@media screen and (min-width: $AwakningMediaQueryDesktopMinWidth) {
  .site-header__logo--size-desktop {
    width: 115px;
  }
}
</style>
