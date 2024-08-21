<script setup lang="ts">
import {
  onMounted,
  onUnmounted,
  ref,
  type Ref,
  type PropType,
  defineAsyncComponent,
  computed,
  type ComputedRef,
} from "vue";
import type { Slide } from "@/data/components";
import MyTransition from "./MyTransition.vue";
const HeroSlide = defineAsyncComponent(() => import("./HeroSlide.vue"));

const { slides } = defineProps({
  slides: { type: Object as PropType<Slide[] | undefined> },
});

const slidesLength: ComputedRef<number | undefined> = computed(
  () => slides?.length
);

const currentDisplayedSlideIndex: Ref<number> = ref(0);
const duration = 86400000; // Setted to 1 day to avoid scroll to bottom bug caused by the transition (v-show used with v-for)
let timer: number;
let touchStartX: number;
let touchEndX: number;

/* Slide Control */
const startSlide = () => (timer = setInterval(() => displayNextSlide(), 3500));
const stopSlide = () => clearInterval(timer);

/* Display Logic */
const displayPrevSlide = () => {
  if (typeof slidesLength.value === "number" && slidesLength.value > 0) {
    if (currentDisplayedSlideIndex.value > 0) {
      currentDisplayedSlideIndex.value--;
    } else {
      currentDisplayedSlideIndex.value = slidesLength.value - 1;
    }
  }
};
const displayNextSlide = () => {
  if (typeof slidesLength.value === "number" && slidesLength.value > 0) {
    if (currentDisplayedSlideIndex.value >= slidesLength.value - 1) {
      currentDisplayedSlideIndex.value = 0;
    } else {
      currentDisplayedSlideIndex.value++;
    }
  }
};

/* Control Logic */
const swipeSlide = () => {
  if (typeof slidesLength.value === "number" && slidesLength.value > 0) {
    if (touchStartX > touchEndX) {
      displayPrevSlide();
    } else if (touchStartX < touchEndX) {
      displayNextSlide();
    }
  }
};

/* Handlers */
const handleTouchStart = (e: TouchEvent) => {
  stopSlide();
  touchStartX = e.changedTouches[0].screenX;
};
const handleTouchEnd = (e: TouchEvent) => {
  touchEndX = e.changedTouches[0].screenX;
  swipeSlide();
  startSlide();
};

/* Life Cycles */
onMounted(() => {
  startSlide();
});
onUnmounted(() => {
  stopSlide();
});
</script>

<template>
  <div
    class="slideShow"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
    data-testid="slideShow"
  >
    <MyTransition :duration :group="true" name="fadeSlideShow">
      <template v-for="(slide, index) in slides" :key="slide.id">
        <HeroSlide
          :slide
          :slideIndex="index"
          :slidesLength="slides?.length"
          @display-selected-slide="
            (payload) => (currentDisplayedSlideIndex = payload)
          "
          v-show="index === currentDisplayedSlideIndex"
        />
      </template>
    </MyTransition>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/_constants" as *;

.slideShow {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 15px;
  position: relative;
  @media screen and (min-width: $AwakningBreakpointDesktop) {
    padding: 0;
    align-items: stretch; // extend width's limit of the native slide image
  }
}
</style>
