<script setup lang="ts">
const { isDropdownOpen } = defineProps({
  isDropdownOpen: { type: Boolean, required: true },
});
</script>

<template>
  <header
    class="site-nav__dropdown-header site-nav__item"
    :class="{ 'site-nav__dropdown-header--hover': isDropdownOpen }"
  >
    <slot />
    <span class="site-nav__dropdown-header-icon">
      <template v-if="isDropdownOpen">▲</template>
      <template v-else>▼</template></span
    >
  </header>
</template>

<style scoped lang="scss">
@use "@/assets/styles/_constants.scss" as *;

.site-nav__dropdown-header {
  display: flex;
  align-items: center;

  &--hover {
    background-color: $AwakningColorWhite;
    box-shadow: $AwakningBoxShadow;

    &::after {
      content: "";
      position: absolute;
      width: calc(100% - ($siteNavItemPaddingX * 2));
      height: 1px;
      background-color: $AwakningColorBlack;
      bottom: 0;
      z-index: 1;
    }
  }

  &-icon {
    font-size: 0.625rem;
    margin-left: 4px;
  }
}
</style>
