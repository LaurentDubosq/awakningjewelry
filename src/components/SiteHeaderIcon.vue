/** This component manage both icons wrapped by button or by link */

<script setup lang="ts">
const { behavior, url } = defineProps({
  behavior: { type: String, required: true },
  url: { type: String, required: true },
});
</script>

<template>
  <template v-if="behavior === 'button'">
    <button type="button" class="site-header__icon-area">
      <div class="site-header__icon-size">
        <slot />
      </div>
    </button>
  </template>
  <template v-else-if="behavior === 'link'">
    <RouterLink :to="url" class="site-header__icon-area">
      <div class="site-header__icon-size">
        <slot />
      </div>
    </RouterLink>
  </template>
</template>

<style scoped lang="scss">
.site-header__icon {
  &-area {
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &-size {
    width: 27px;
  }
}
</style>
