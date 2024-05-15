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
    class="site-header__logo site-header__logo--size-desktop"
  />
</template>
