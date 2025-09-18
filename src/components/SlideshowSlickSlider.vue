<!-- This component has attached documentation. This concerns NVDA reading interruption,
 focus event side effect, peripheric displaying permission, feature's label reading ability.
 Find it at docs/features/SlideshowSlickSlider.md -->

<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'

const { slidesLength, activeIndex } = defineProps<{
  slidesLength: number
  activeIndex: number
}>()
const emit = defineEmits<{
  displaySlide: [number]
  handleFocus: []
  handleBlur: []
}>()

const buttons: Ref<HTMLButtonElement[] | null> = ref(null)
const isKeyboardNavigation: Ref<boolean> = ref(false)

const getNextIndex = () => (activeIndex < slidesLength - 1 ? activeIndex + 1 : 0)

const getPreviousIndex = () => (activeIndex > 0 ? activeIndex - 1 : slidesLength - 1)

const handleKeydown = (event: KeyboardEvent) => {
  let index: number | undefined

  switch (event.key) {
    case 'ArrowLeft':
      index = getPreviousIndex()
      break
    case 'ArrowRight':
      index = getNextIndex()
      break
    case 'Home':
      event.preventDefault() // old method because .prevent on the element blocks the tab sequence on the element
      index = 0
      break
    case 'End':
      event.preventDefault() // old method because .prevent on the element blocks the tab sequence on the element
      index = slidesLength - 1
      break
  }

  if (index !== undefined) {
    emit('displaySlide', index)
  }
}

const handleFocus = () => {
  // Add the slick slider focuses for keyboard navigation only
  isKeyboardNavigation.value = true

  // Emit the custom event
  emit('handleFocus')
}

const handleBlur = () => {
  // Remove the slick slider focuses for keyboard navigation only
  isKeyboardNavigation.value = false

  // Emit the custom event
  emit('handleBlur')
}

// Focus any new selected button for keyboard navigation only
watch(
  () => activeIndex,
  () => {
    if (buttons.value && isKeyboardNavigation.value) {
      buttons.value[activeIndex].focus()
    }
  },
)
</script>

<template>
  <div
    class="slideshow__slick-slider"
    :class="{ 'focus-visible': isKeyboardNavigation }"
    role="group"
    aria-label="Manual slideshow navigation"
    data-testid="slideshow__slick-slider"
  >
    <div class="slideshow__slick-slider-role" role="tablist">
      <button
        class="slideshow__slick-slider-button"
        :class="{
          'slideshow__slick-slider-button--active': index === activeIndex,
        }"
        ref="buttons"
        v-for="(_, index) in slidesLength"
        @mousedown.prevent
        @click="$emit('displaySlide', index)"
        @touchend.prevent
        @keydown="handleKeydown"
        @focus="handleFocus"
        @blur="handleBlur"
        role="tab"
        :aria-label="`Slide ${index + 1}`"
        :aria-selected="index === activeIndex && isKeyboardNavigation ? 'true' : 'false'"
        :aria-controls="`slideshow-${index + 1}`"
        :tabindex="index === activeIndex ? undefined : -1"
        :title="`Display slide ${index + 1}`"
        data-testid="slideshow__slick-slider-button"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants' as *;

.slideshow__slick-slider {
  z-index: 1;
  position: absolute;

  @media screen and (min-width: $breakpointDesktop) {
    bottom: 20px;
  }

  &-role {
    padding: 4px;
    display: flex;
    gap: 10px;
  }

  &-button {
    width: 10px;
    height: 10px;
    border: 2px solid $AwakningColorPrimary;
    border-radius: 10px;
  }
  &-button:hover {
    transform: scale(1.5);
    border-width: 1.5px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  &-button--active {
    background-color: $AwakningColorPrimary;
  }
}
</style>
