<script setup lang="ts">
import {
  computed,
  defineAsyncComponent,
  onMounted,
  onUnmounted,
  ref,
  type ComputedRef,
  type Ref,
} from "vue";
import { getHeroSlides } from "@/composables/fetch";
import type { HeroSlideType } from "@/data/components";
import MyTransition from "./MyTransition.vue";

const HeroSlide = defineAsyncComponent(() => import("./HeroSlide.vue"));

const slides: Ref<HeroSlideType[] | undefined> = ref(undefined);
const slidesLength: ComputedRef<number | undefined> = computed(
  () => slides.value?.length
);
const displayedSlideIndex: Ref<number> = ref(0);
let timer: number;
let touchStartX: number;
let touchEndX: number;

/* Slide Control */
const startSlide = () => (timer = setInterval(() => displayNextSlide(), 3500));
const stopSlide = () => clearInterval(timer);

/* Display Logic */
const displayPrevSlide = () => {
  if (slidesLength.value) {
    if (displayedSlideIndex.value > 0) {
      displayedSlideIndex.value--;
    } else {
      displayedSlideIndex.value = slidesLength.value - 1;
    }
  }
};
const displayNextSlide = () => {
  if (slidesLength.value) {
    if (displayedSlideIndex.value >= slidesLength.value - 1) {
      displayedSlideIndex.value = 0;
    } else {
      displayedSlideIndex.value++;
    }
  }
};
const displaySelectedSlide = (expectedSlideIndex: number) => {
  stopSlide();
  displayedSlideIndex.value = expectedSlideIndex;
};

/* Control Logic */
const swipeSlide = () => {
  if (slidesLength.value) {
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
onMounted(async () => {
  slides.value = await getHeroSlides();
  startSlide();
});
onUnmounted(() => {
  stopSlide();
});
</script>

<template>
  <section
    class="hero"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
    data-testid="hero"
  >
    <MyTransition :group="true" name="fadeHero">
      <template v-for="(slide, index) in slides" :key="slide.id">
        <HeroSlide
          :displayedSlideIndex="index"
          :slide
          :slidesLength
          @display-selected-slide="displaySelectedSlide"
          v-show="index === displayedSlideIndex"
        />
      </template>
    </MyTransition>
  </section>
</template>

<style scoped lang="scss">
@use "@/assets/styles/_constants" as *;

.hero {
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
