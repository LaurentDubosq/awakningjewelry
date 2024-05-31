<script setup lang="ts">
import { pagesMetaData } from "@/router/index";
import type { PageMetaData } from "@/data/seo";
const homeMetaData: PageMetaData | undefined = pagesMetaData?.find(
  () => "home"
);
</script>

<template>
  <img
    src="@/assets/logo.svg"
    alt="AwakningJewelry's logo - Illustration of a person medidating above the AwakningJewelry brand name"
    :title="homeMetaData?.title"
    class="site-logo"
  />
</template>

<style scoped lang="scss">
@use "@/assets/styles/_constants.scss" as *;

.site-logo {
  display: block;
  width: 81px;
}

@media screen and (min-width: $AwakningMediaQueryDesktopMinWidth) {
  .site-logo {
    width: 115px;
  }
}
</style>
