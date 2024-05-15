<script setup lang="ts">
const { url } = defineProps({
  url: { type: String, required: true },
});
</script>

<template>
  <RouterLink class="site-nav__link" :to="`${url}`">
    <slot />
  </RouterLink>
</template>

<style lang="scss">
@use "@/assets/styles/_constants.scss" as *;

/* The current style tag is unscoped to allow SiteNavDropdownHeader to use the "site-nav__link" CSS class */
.site-nav__link {
  padding: $siteNavLinkPaddingX;
  font-family: $AwakningFontMontserrat;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
</style>
