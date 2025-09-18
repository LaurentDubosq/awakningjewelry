<script setup lang="ts">
const { text, title, isDropdownOpen } = defineProps<{
  text: string
  title: string
  isDropdownOpen: boolean
}>()

const id = text.toLowerCase()
</script>

<template>
  <button
    class="site-nav__dropdown-button site-nav__link--text"
    :class="{ 'site-nav__dropdown-button--open': isDropdownOpen }"
    @click="$emit('toggleDropdown')"
    @touchstart="$emit('toggleDropdown')"
    @touchend.prevent
    :aria-expanded="isDropdownOpen ? 'true' : 'false'"
    :aria-controls="`site-nav__dropdown-list-${id}`"
    :title="title"
    data-testid="site-nav__dropdown-button"
  >
    {{ text }}
    <span
      class="site-nav__dropdown-button-icon"
      aria-hidden="true"
      data-testid="site-nav__dropdown-button-icon"
    >
      <template v-if="isDropdownOpen">▲</template>
      <template v-else>▼</template></span
    >
  </button>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants.scss' as *;

.site-nav__dropdown-button {
  display: flex;
  align-items: center;

  &--open {
    background-color: $AwakningColorSecondary;
    box-shadow: $AwakningBoxShadow;

    &::after {
      content: '';
      position: absolute;
      width: calc(
        100% - ($siteNavLinkPaddingX * 2)
      ); // calculate the width by fetching the padding defined on "site-nav__link--text" element
      height: 1px;
      background-color: $AwakningColorPrimary;
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
