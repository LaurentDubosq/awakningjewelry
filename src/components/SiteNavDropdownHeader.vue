<script setup lang="ts">
const { isDropdownOpen } = defineProps({
  isDropdownOpen: { type: Boolean, required: true },
});
</script>

<template>
  <header class="site-nav__dropdown-header">
    <div
      class="site-nav__dropdown-title site-nav__link"
      :class="{ 'site-nav__dropdown-title--hover': isDropdownOpen }"
    >
      <slot />
      <span class="site-nav__dropdown-title-icon">
        <template v-if="isDropdownOpen">▲</template>
        <template v-else>▼</template></span
      >
    </div>
  </header>
</template>

<style scoped lang="scss">
@use "@/assets/styles/_constants.scss" as *;

.site-nav__dropdown-title {
  display: flex;
  align-items: center;

  &--hover {
    background-color: $AwakningColorWhite;
    box-shadow: $AwakningBoxShadow;

    &::after {
      content: "";
      position: absolute;
      width: calc(100% - ($siteNavLinkPaddingX * 2));
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
