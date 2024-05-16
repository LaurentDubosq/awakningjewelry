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

.marginLeftMinus300px-enter-active,
.marginLeftMinus300px-leave-active {
  transition: all 0.3s ease;
}
.marginLeftMinus300px-enter-from,
.marginLeftMinus300px-leave-to {
  margin-left: -300px;
}

.margintopMinus100PerCentWithInner-enter-active .transition,
.margintopMinus100PerCentWithInner-leave-active .transition {
  transition: all 0.3s ease;
}
.margintopMinus100PerCentWithInner-enter-from .transition,
.margintopMinus100PerCentWithInner-leave-to .transition {
  margin-top: -100%;
}
</style>
