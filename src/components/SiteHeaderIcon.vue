<script setup lang="ts">
const { alternativeText } = defineProps({
  alternativeText: { type: String, required: true },
});
</script>

<template>
  <div class="site-header__icon-clickable-area">
    <slot />
    <span
      class="site-header__icon-text sr-only"
      data-testid="site-header__icon-text"
      >{{ alternativeText }}</span
    >
  </div>
</template>

<style scoped lang="scss">
.site-header__icon-clickable-area {
  width: 50px;
  height: 50px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
</style>
