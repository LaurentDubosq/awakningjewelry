<script setup lang="ts">
import { TransitionGroup, Transition } from 'vue'

const { name, group } = defineProps<{
  name: string
  group: boolean
  duration?: number
}>()
</script>

<template>
  <component :name :is="group ? TransitionGroup : Transition" :duration><slot /></component>
</template>

<style lang="scss">
@use '@/assets/styles/_constants' as *;

/* translateY */
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

/* marginLeftMinus300px */
.marginLeftMinus300px-enter-active,
.marginLeftMinus300px-leave-active {
  transition: all 0.3s ease;
}
.marginLeftMinus300px-enter-from,
.marginLeftMinus300px-leave-to {
  margin-left: -300px;
}

/* margintopMinus100PerCentWithInner */
.margintopMinus100PerCentWithInner-enter-active .transition,
.margintopMinus100PerCentWithInner-leave-active .transition {
  transition: all 0.3s ease;
}
.margintopMinus100PerCentWithInner-enter-from .transition,
.margintopMinus100PerCentWithInner-leave-to .transition {
  margin-top: -100%;
}
</style>
