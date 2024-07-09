<script setup lang="ts">
import type { PageMetaData } from "@/data/seo";
import { getPagesMetaData } from "@/composables/fetch";
import { computed, onMounted, ref, type Ref, type ComputedRef } from "vue";

const pagesMetaData: Ref<PageMetaData[] | undefined> = ref();

const homeMetaData: ComputedRef<PageMetaData | undefined> = computed(() => {
  return pagesMetaData.value?.find(() => "home");
});

onMounted(async () => {
  pagesMetaData.value = await getPagesMetaData();
});
</script>

<template>
  <img
    src="@/assets/logo.svg"
    alt="AwakningJewelry's logo - Illustration of a person medidating above the AwakningJewelry brand name"
    :title="homeMetaData?.title"
    class="site-logo"
    data-testid="site-logo"
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
