<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watch,
  type ComputedRef,
  type Ref,
} from 'vue'
import { useIsOnMobileStore } from '@/stores/isOnMobile'
import { useIsReducedMotionStore } from '@/stores/isReducedMotion'
import { storeToRefs } from 'pinia'
import SlideshowAutorotationButton from './SlideshowAutorotationButton.vue'
import SlideshowSlickSlider from './SlideshowSlickSlider.vue'
import { useGetClientHeightAtElementResize } from '@/composables/useGetClientHeightAtElementResize'

/****************/
/* Dependencies */
/****************/

// Get the slides length to manage the looping behavior and to calculte the number of slick slider dots
const { slidesLength } = defineProps<{
  slidesLength: number
}>()
// Get the environement to restrains the position calculation of slick slider to mobile
const isOnMobileStore = useIsOnMobileStore()
const { isOnMobile } = storeToRefs(isOnMobileStore)

/*******************/
/* Reactive states */
/*******************/

// Store the index corresponding to the displayed slide
const currentIndex: Ref<number> = ref(0)
// Store the autorotation slideshow statut
const isPlaying: Ref<boolean> = ref(true)
// Stores the user's command to stop auto-rotation
const isPlayingExplicitly: Ref<boolean | null> = ref(null)

/*********/
/* Logic */
/*********/

/* Autoplaying Logic */
onMounted(() => {
  // Get the dynamic OS/browser "reduced motion" user preference statut from store
  const isReducedMotionStore = useIsReducedMotionStore()
  const { isReducedMotion } = storeToRefs(isReducedMotionStore)

  // Watch its value to toggle the animation in live
  watch(
    isReducedMotion,
    () => {
      if (isReducedMotion.value) {
        stopAutoPlayExplicitly()
      } else {
        startAutoPlay()
      }
    },
    { immediate: true },
  )
})
onUnmounted(() => {
  stopAutoPlay()
})

/* Hover Logic */
const handleMouseenter = () => {
  if (isPlayingExplicitly.value === null) {
    stopAutoPlay()
  }
}
const handleMouseleave = () => {
  if (isPlayingExplicitly.value === null) {
    startAutoPlay()
  }
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
  // Stop autorotation explicitly
  stopAutoPlayExplicitly()

  // Store the touchStart position
  touchStartX = e.changedTouches[0].screenX // "screenX" avoid conflit when scrolling at the same time versus "clientX"
}
const handleTouchend = (e: TouchEvent) => {
  // Store the touchEnd position
  touchEndX = e.changedTouches[0].screenX // "screenX" avoid conflit when scrolling at the same time versus "clientX"

  // Try to swipe
  swipeSlide()
}

/* Slideshow focus logic */
const handleFocusIn = () => {
  // If the user has chosen to pause or resume the carousel autorotation, we do nothing
  if (isPlayingExplicitly.value === true || isPlayingExplicitly.value === false) {
    return
  }

  // Any slideshow element focus stop the autorotation explicitly
  stopAutoPlay()
}

/* Autorotation Button Logic */
const handleStopAutoplay = () => {
  // Stop autorotation explicitly
  stopAutoPlayExplicitly()
}
const handleStartAutoplay = () => {
  // Start autorotation explicitly
  startAutoPlayExplicitly()
}

/* Slick Slider Buttons Logic */
const focusCurrentSlickSliderButton = async () => {
  if (slideshowElement.value) {
    await nextTick()
    const slickSliderButtonElement: HTMLElement | null =
      slideshowElement.value.querySelector("[aria-selected='true']")
    if (slickSliderButtonElement) {
      slickSliderButtonElement.focus()
    }
  }
}
const handleDisplaySlide = (event: { index: number; focusable: boolean }) => {
  // Stop autorotation explicitly
  stopAutoPlayExplicitly()

  // Display the expected slide
  currentIndex.value = event.index

  // Focus on its corresponding button for a keyboard navigation
  if (event.focusable) {
    focusCurrentSlickSliderButton()
  }
}

/* Display Logic */
let timer: ReturnType<typeof setInterval>

const startAutoPlay = () => {
  timer = setInterval(() => displayNextSlide(), 3500)
  isPlaying.value = true
}
const stopAutoPlay = () => {
  clearInterval(timer)
  isPlaying.value = false
}

const displayPrevSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  } else {
    currentIndex.value = slidesLength - 1
  }
}
const displayNextSlide = () => {
  if (currentIndex.value >= slidesLength - 1) {
    currentIndex.value = 0
  } else {
    currentIndex.value++
  }
}

/* Slick Slider Mobile Positioning */
const slideshowElement: Ref<HTMLPictureElement | null> = ref(null)

// Store the value used to position the slick slide from the top of its referent parent on mobile
const slickSliderTopPosition: Ref<Ref<number> | null> = ref(null) // Nested refs necessary to have reactivity at intial render and during updates

// Compute the style object to improve template readability
const slickSliderStyle: ComputedRef<object | undefined> = computed(() => {
  if (slickSliderTopPosition?.value?.value) {
    return {
      top: `${slickSliderTopPosition.value.value}px`,
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
        slickSliderTopPosition.value = clientHeight
      } else {
        slickSliderTopPosition.value = null
      }
    })
  }
})

/* Utilities */
const stopAutoPlayExplicitly = () => {
  // Stop Autorotation
  stopAutoPlay()

  // Store user explicit intention to stop autorotation
  isPlayingExplicitly.value = false
}
const startAutoPlayExplicitly = () => {
  // Start Autorotation
  startAutoPlay()

  // Store user explicit intention to start autorotation
  isPlayingExplicitly.value = true
}
</script>

<template>
  <div
    ref="slideshowElement"
    class="slideshow"
    @mouseenter="handleMouseenter"
    @mouseleave="handleMouseleave"
    @touchstart.passive="handleTouchstart"
    @touchend="handleTouchend"
    @focusin="handleFocusIn"
    :aria-live="isPlaying ? 'off' : 'polite'"
    data-testid="slideshow"
  >
    <div class="slideshow__controls wrapper">
      <SlideshowAutorotationButton
        :isPlaying
        @stopAutoplay="handleStopAutoplay"
        @startAutoplay="handleStartAutoplay"
      />
    </div>
    <SlideshowSlickSlider
      :slidesLength
      :currentIndex
      @displaySlide="handleDisplaySlide"
      :style="slickSliderStyle"
    />
    <slot :currentIndex />
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants' as *;

.slideshow {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 15px;
  position: relative;
  @media screen and (min-width: $AwakningBreakpointDesktop) {
    padding: 0;
  }

  &__controls {
    position: absolute;
    bottom: 0;
    width: 100%;
    line-height: 0;
    z-index: 2;
  }
}

:slotted(.slideshow__slide) {
  position: absolute;
  opacity: 0;
  z-index: 0;
  transition: opacity 1s ease;
  padding: 0 15px;
  @media screen and (min-width: $AwakningBreakpointDesktop) {
    padding: 0;
  }
}

:slotted(.slideshow__slide--active) {
  position: static;
  opacity: 1;
  z-index: 1;
  padding: 0;
}
</style>
