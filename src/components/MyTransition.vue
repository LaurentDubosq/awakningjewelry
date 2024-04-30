<script setup lang="ts">
const { name } = defineProps({ name: { type: String, required: true } });
</script>

<template>
  <Transition :name="name">
    <slot />
  </Transition>
</template>

<style lang="scss">
.translateY-enter-active {
  transition: all 0.3s ease;
}

.translateY-leave-active {
  transition: all;
}

.translateY-enter-from,
.translateY-leave-to {
  transform: translateY(-15px);
}
</style>
