<script setup lang="ts">
const { url } = defineProps({ url: { type: String, required: true } });
</script>

<template>
  <RouterLink :to="url">
    <div class="site-header__icon-clickable-area">
      <div class="site-header__icon-size">
        <slot />
      </div>
    </div>
  </RouterLink>
</template>
