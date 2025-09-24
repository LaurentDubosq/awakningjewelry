<script setup lang="ts">
import { TransitionGroup, Transition } from 'vue'

const { name, group } = defineProps<{
  name:
    | 'vertical-top-subtle-slide'
    | 'horizontal-left-slide'
    | 'nested-vertical-top-slide'
    | 'vertical-top-slide'
  group: boolean
  duration?: number
}>()
</script>

<template>
  <component :name :is="group ? TransitionGroup : Transition" :duration><slot /></component>
</template>

<style lang="scss">
@use '@/assets/styles/_constants' as *;

/* Vertical subtle slide (top edge) */
.vertical-top-subtle-slide-enter-active {
  transition: all 0.3s ease;
}
.vertical-top-subtle-slide-leave-active {
  transition: all;
}
.vertical-top-subtle-slide-enter-from,
.vertical-top-subtle-slide-leave-to {
  transform: translateY(-15px);
}

/* Horizontal slide (left edge) */
.horizontal-left-slide-enter-active,
.horizontal-left-slide-leave-active {
  transition: all 0.3s ease;
}
.horizontal-left-slide-enter-from,
.horizontal-left-slide-leave-to {
  margin-left: -300px;
}

/* Vertical slide (top edge) */
.vertical-top-slide-enter-active,
.vertical-top-slide-leave-active {
  transition: all 0.3s ease;
}
.vertical-top-slide-enter-from,
.vertical-top-slide-leave-to {
  margin-top: -40px;
}

/* Nested Vertical slide (top edge) */
.nested-vertical-top-slide-enter-active .transition,
.nested-vertical-top-slide-leave-active .transition {
  transition: all 0.3s ease;
}
.nested-vertical-top-slide-enter-from .transition,
.nested-vertical-top-slide-leave-to .transition {
  margin-top: -100%;
}
</style>
