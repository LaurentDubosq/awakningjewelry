<template>
  <div class="site-nav__item">
    <slot />
  </div>
</template>

<style lang="scss">
@use "@/assets/styles/_constants.scss" as *;

/* The current style tag is unscoped to allow SiteNavDropdownHeader to use the "site-nav__item" CSS class */
.site-nav__item {
  padding: $siteNavItemPaddingX;
  font-family: $AwakningFontMontserrat;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
</style>
