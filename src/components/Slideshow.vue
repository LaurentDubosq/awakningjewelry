<!-- This component has attached documentation. This concerns explicit user will, phantom events,
 INP problem, slide reading perimeter, unability to read slide, same slide read twice.
 Find it at docs/features/Slideshow.md -->

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch, type ComputedRef, type Ref } from 'vue'
import { useIsOnMobileStore } from '@/stores/isOnMobile'
import { useIsReducedMotionStore } from '@/stores/isReducedMotion'
import { storeToRefs } from 'pinia'
import SlideshowAutorotationButton from './SlideshowAutorotationButton.vue'
import SlideshowSlickSlider from './SlideshowSlickSlider.vue'
import useGetClientHeightAtElementResize from '@/composables/useGetClientHeightAtElementResize'

/****************/
/* Dependencies */
/****************/

// Get the slides length to manage the looping behavior and to calculte the number of slick slider dots
const { slidesLength } = defineProps<{
  slidesLength: number
}>()
// Get the environment to position the slick slider on mobile
const isOnMobileStore = useIsOnMobileStore()
const { isOnMobile } = storeToRefs(isOnMobileStore)

/**********/
/* States */
/**********/

// Store the index corresponding to the displayed slide
const activeIndex: Ref<number> = ref(0)
// Store the autorotation slideshow state
const isPlaying: Ref<boolean> = ref(true)
// Stores the user's command to stop auto-rotation
const isPlayingExplicitly: Ref<boolean | null> = ref(null)
// Prevent screen reader reading outside of slideshow
const isSlideSRReadable: Ref<boolean | undefined> = ref()
// Store touch event to avoid touch events triggering mouse events
const isTouched: Ref<boolean | undefined> = ref()
// Handle slide label screen reader readability
const isSlideLabelSRReadable: Ref<boolean | undefined> = ref()
// Store whether keyboard navigation should disable transition for JAWS auto-rotation button reading
const isKeyboardNavigation: Ref<boolean | undefined> = ref()
// Store active index defered to delay slide display and allow screen reader reads slide content when new slick slider button is focused
const deferredActiveIndex: Ref<number> = ref(activeIndex.value)

/*********/
/* Logic */
/*********/

/* Autorotation Logic */

let timer: ReturnType<typeof setInterval>

const startAutoplay = () => {
  timer = setInterval(() => displayNextSlide(), 3500)
  isPlaying.value = true
}
const stopAutoplay = () => {
  clearInterval(timer)
  isPlaying.value = false
}

const stopAutoplayExplicitly = () => {
  // Stop Autorotation
  stopAutoplay()

  // Store user explicit intention to stop autorotation
  isPlayingExplicitly.value = false
}
const startAutoplayExplicitly = () => {
  // Start Autorotation
  startAutoplay()

  // Store user explicit intention to start autorotation
  isPlayingExplicitly.value = true
}
const toggleAutoplayExplicitly = () => {
  if (isPlaying.value) {
    stopAutoplayExplicitly()
  } else {
    startAutoplayExplicitly()
  }
}

/* Display Logic */

const displayPrevSlide = () => {
  if (activeIndex.value > 0) {
    activeIndex.value--
  } else {
    activeIndex.value = slidesLength - 1
  }
}
const displayNextSlide = () => {
  if (activeIndex.value >= slidesLength - 1) {
    activeIndex.value = 0
  } else {
    activeIndex.value++
  }
}

/* Hover Logic */

const handleMouseenter = () => {
  // Avoid touch events triggering mouse events
  if (isTouched.value) return

  // Pause autorotation
  if (isPlayingExplicitly.value === null) {
    stopAutoplay()
  }
}
const handleMouseleave = () => {
  // Avoid touch events triggering mouse events
  if (isTouched.value) return

  // Replay autorotation
  if (isPlayingExplicitly.value === null) {
    startAutoplay()
  }

  // Reset isTouched state for future events
  isTouched.value = undefined
}

/* Swipe Logic */

let touchStartX: number
let touchEndX: number

const isSwipingLeft = () => {
  return touchStartX - touchEndX >= 20
}
const isSwipingRight = () => {
  return touchStartX - touchEndX <= -20
}
const swipeSlide = () => {
  if (isSwipingLeft()) {
    displayPrevSlide()
  } else if (isSwipingRight()) {
    displayNextSlide()
  }
}
const handleTouchstart = (e: TouchEvent) => {
  // Avoid touch events triggering mouse events
  isTouched.value = true

  // Stop autorotation explicitly
  stopAutoplayExplicitly()

  // Store the touchStart position
  touchStartX = e.changedTouches[0].screenX // "screenX" avoid conflit when scrolling at the same time versus "clientX"
}
const handleTouchend = (e: TouchEvent) => {
  // Store the touchEnd position
  touchEndX = e.changedTouches[0].screenX // "screenX" avoid conflit when scrolling at the same time versus "clientX"

  // Try to swipe
  swipeSlide()
}

/* Autorotation Button Logic */

const isAutorotationButtonFocused: Ref<boolean | undefined> = ref()

const handleAutorotationButtonFocus = () => {
  // Deactivate slide transition for Jaws
  isKeyboardNavigation.value = true

  // Help to display hero slide label
  isAutorotationButtonFocused.value = true

  // Allow screen reader to read the slide content
  isSlideSRReadable.value = true
}

const handleAutorotationButtonBlur = async () => {
  // Help to hide hero slide label
  isAutorotationButtonFocused.value = false

  // Disallow screen reader to read the slide content
  isSlideSRReadable.value = false

  // Active slide transition for no assistive technologies
  isKeyboardNavigation.value = false
}

// Active hero slide label SR reading when autorotation button is focused and autorotation is playing
watch([deferredActiveIndex, isAutorotationButtonFocused], async () => {
  if (isAutorotationButtonFocused.value && isPlaying.value) {
    // Display hero slide label
    isSlideLabelSRReadable.value = true
  } else {
    // Hide hero slide label for screen reader
    isSlideLabelSRReadable.value = false
  }
})
watch(isPlaying, () => {
  // Deactivate hero slide label when autorotation is paused
  if (!isPlaying.value) {
    // Hide hero slide label for screen reader
    isSlideLabelSRReadable.value = false
  }
})

/* Slick Slider Logic */

const handleSlickSliderDisplaySlide = (index: number) => {
  // Stop autorotation explicitly
  stopAutoplayExplicitly()

  // Display the expected slide
  activeIndex.value = index
}

const handleSlickSliderFocus = () => {
  // Stop autorotation explicitly
  stopAutoplayExplicitly()

  // Deactivate slide transition for Jaws
  isKeyboardNavigation.value = true

  // Allow screen reader to read the slide content
  isSlideSRReadable.value = true
}

const handleSlickSliderBlur = () => {
  // Disallow screen reader to read the slide content
  isSlideSRReadable.value = false

  // Active slide transition no assistive technologies
  isKeyboardNavigation.value = false
}

/* A11y Logic */

// Allow or disallow automatic rotation according to OS/browser "reduced motion" user preference
onMounted(() => {
  // Get the dynamic OS/browser "reduced motion" user preference statut from store
  const isReducedMotionStore = useIsReducedMotionStore()
  const { isReducedMotion } = storeToRefs(isReducedMotionStore)

  // Watch its value to toggle the animation in live
  watch(
    isReducedMotion,
    () => {
      if (isReducedMotion.value) {
        stopAutoplayExplicitly()
      } else {
        startAutoplay()
      }
    },
    { immediate: true },
  )
})
onUnmounted(() => {
  stopAutoplay()
})

// Delay slide display to allow screen reader reads slide content when new slick slider button is focused
watch(activeIndex, () => {
  setTimeout(() => {
    deferredActiveIndex.value = activeIndex.value
  }, 200)
})

/***************/
/* Positioning */
/***************/

/* Slick Slider Mobile Positioning */

const slideshowElement: Ref<HTMLPictureElement | null> = ref(null)

// Store the value used to position the slick slide from the top of its referent parent on mobile
const slickSliderTopPosition: Ref<number | null> = ref(null) // Nested refs necessary to have reactivity at intial render and during updates

// Compute the style object to improve template readability
const slickSliderStyle: ComputedRef<object | undefined> = computed(() => {
  if (slickSliderTopPosition?.value) {
    return {
      top: `${slickSliderTopPosition.value}px`,
    }
  }
  return undefined
})

onMounted(() => {
  // Get the first picture tag (all images must have the same native dimensions)
  const pictureElement: HTMLPictureElement | null | undefined =
    slideshowElement.value?.querySelector('picture')

  if (pictureElement) {
    // Get the picture tag clientHeight at every resize
    const clientHeight = useGetClientHeightAtElementResize(pictureElement)

    // Set the slick slider position only on mobile
    watch(clientHeight, () => {
      if (isOnMobile && isOnMobile.value) {
        slickSliderTopPosition.value = clientHeight.value
      } else {
        slickSliderTopPosition.value = null
      }
    })
  }
})
</script>

<template>
  <div
    class="slideshow"
    ref="slideshowElement"
    @mouseenter="handleMouseenter"
    @mouseleave="handleMouseleave"
    @touchstart.passive="handleTouchstart"
    @touchend="handleTouchend"
    data-testid="slideshow"
  >
    <div class="slideshow__autorotation-button-wrapper wrapper">
      <SlideshowAutorotationButton
        :is-playing
        @toggle-autoplay-explicitly="toggleAutoplayExplicitly"
        @handleFocus="handleAutorotationButtonFocus"
        @handleBlur="handleAutorotationButtonBlur"
      />
    </div>
    <SlideshowSlickSlider
      class="slideshow__slick-slider"
      :slides-length
      :active-index
      @display-slide="handleSlickSliderDisplaySlide"
      @stop-autoplay-explicitly="stopAutoplayExplicitly"
      @handle-focus="handleSlickSliderFocus"
      @handle-blur="handleSlickSliderBlur"
      :style="slickSliderStyle"
    />
    <div
      class="slideshow__slides"
      @focusin="stopAutoplayExplicitly"
      :aria-live="isSlideSRReadable ? 'polite' : 'off'"
      data-testid="slideshow__slides"
    >
      <slot :deferred-active-index :is-slide-label-s-r-readable :is-keyboard-navigation />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants' as *;

.slideshow {
  width: 100%;
  position: relative;

  &__autorotation-button-wrapper {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    z-index: 1;
  }

  &__slick-slider {
    left: 50%;
    transform: translateX(-50%);
  }
}

:slotted(.slideshow__slide) {
  position: absolute;
  top: 0;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 1s ease,
    visibility 0s linear 1s; /* delay visibility change */
  z-index: -1;
}
:slotted(.slideshow__slide--no-transition) {
  transition: all 0s ease 0s;
}

:slotted(.slideshow__slide--active) {
  position: relative;
  top: 0;
  opacity: 1;
  visibility: visible;
  transition-delay: 0s;
  z-index: 0;
}
</style>
