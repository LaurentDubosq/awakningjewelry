<script setup lang="ts">
import { onMounted, onUnmounted, ref, type Ref } from 'vue'
import IconArrowUp from './icons/IconArrowUp.vue'
import MyTransition from './MyTransition.vue'

const isButtonDisplay: Ref<boolean> = ref(false)
const isButtonHover: Ref<boolean> = ref(false)

const scrollToTop = () => {
  // Move to top
  window.scrollTo({ top: 0, behavior: 'smooth' })

  // Reset button hover state to avoid persistant hover
  isButtonHover.value = false
}
const buttonDisplayCallback = () => {
  if (window.scrollY > window.innerHeight * 3) {
    isButtonDisplay.value = true
  } else {
    isButtonDisplay.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', buttonDisplayCallback)
})
onUnmounted(() => {
  window.removeEventListener('scroll', buttonDisplayCallback)
})
</script>

<template>
  <MyTransition name="fade" :group="false" :duration="300">
    <button
      class="back-to-top"
      :class="{ 'back-to-top--hover': isButtonHover }"
      aria-label="Back to top"
      @click="scrollToTop"
      @mouseenter="isButtonHover = true"
      @mouseleave="isButtonHover = false"
      v-show="isButtonDisplay"
      data-testid="back-to-top"
    >
      <IconArrowUp class="back-to-top__icon" width="50" data-testid="back-to-top__icon" />
    </button>
  </MyTransition>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants' as *;

.back-to-top {
  width: 50px;
  height: 50px;
  background-color: $AwakningColorInactive;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  position: fixed;
  bottom: 20px;
  right: 20px;
  transition: all 0.3s ease;

  @media screen and (min-width: $breakpointDesktop) {
    bottom: 40px;
    right: 40px;
  }

  &--hover {
    background-color: $AwakningColorPrimary;
    cursor: pointer;
  }

  &__icon {
    fill: $AwakningColorSecondary;
  }
}
</style>
