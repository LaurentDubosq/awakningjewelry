<script setup lang="ts">
import type { DisplaySlidePayload } from '@/types/components'
import { ref, type Ref } from 'vue'

const props = defineProps<{
  slidesLength: number
  activeIndex: number
}>()
const emit = defineEmits<{
  'display-slide': [DisplaySlidePayload]
}>()

const isSlickSliderFocused: Ref<boolean> = ref(false)

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowLeft') {
    let payload

    if (props.activeIndex > 0) {
      payload = { index: props.activeIndex - 1, focusable: true }
    } else {
      payload = { index: props.slidesLength - 1, focusable: true }
    }

    emit('display-slide', payload)
  } else if (event.key === 'ArrowRight') {
    let payload

    if (props.activeIndex < props.slidesLength - 1) {
      payload = { index: props.activeIndex + 1, focusable: true }
    } else {
      payload = { index: 0, focusable: true }
    }

    emit('display-slide', payload)
  } else if (event.key === 'Home') {
    event.preventDefault() // old method because .prevent on the element blocks the tab sequence on the element
    emit('display-slide', { index: 0, focusable: true })
  } else if (event.key === 'End') {
    event.preventDefault() // old method because .prevent on the element blocks the tab sequence on the element
    emit('display-slide', {
      index: props.slidesLength - 1,
      focusable: true,
    })
  }
}
</script>

<!-- The following 'mousedown.prevent' listener prevents the 'focus-visible' CSS class
 from being activated by a mouse event, while allowing keyboard events to activate it -->
<template>
  <div
    class="slideshow__slick-slider"
    :class="{ 'focus-visible': isSlickSliderFocused }"
    role="tablist"
    aria-label="Slideshow navigation"
    data-testid="slideshow__slick-slider"
  >
    <button
      class="slideshow__slick-slider-button"
      :class="{
        'slideshow__slick-slider-button--active': index === activeIndex,
      }"
      v-for="(slide, index) in slidesLength"
      @mousedown.prevent
      @click="$emit('display-slide', { index, focusable: false })"
      @keydown="handleKeydown"
      @focus="isSlickSliderFocused = true"
      @blur="isSlickSliderFocused = false"
      role="tab"
      :aria-label="`Slide ${index + 1}`"
      :aria-selected="index === activeIndex ? 'true' : 'false'"
      :aria-controls="`slideshow-${index + 1}`"
      :tabindex="index === activeIndex ? undefined : -1"
      :title="`Display slide ${index + 1}`"
      data-testid="slideshow__slick-slider-button"
    />
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants' as *;

.slideshow__slick-slider {
  z-index: 2;
  position: absolute;
  padding: 4px;
  display: flex;
  gap: 10px;
  @media screen and (min-width: $BreakpointDesktop) {
    bottom: 20px;
  }

  &-button {
    display: block;
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
