<script setup lang="ts">
import SASSCONSTANTS from "@/assets/styles/_constants.module.scss";
import type { Slide } from "@/data/components";
import { useIsOnMobileKey } from "@/utils/injectionkeys";
import {
  computed,
  inject,
  onMounted,
  ref,
  type ComputedRef,
  type PropType,
  type Ref,
} from "vue";

const { slideIndex, slide, slidesLength } = defineProps({
  slide: { type: Object as PropType<Slide>, required: true },
  slideIndex: { type: Number, required: true },
  slidesLength: {
    type: [Number, undefined] as PropType<number | undefined>,
    required: true,
  },
});
const useIsOnMobile: Ref<boolean> | undefined = inject(useIsOnMobileKey); // Get the current display platform
const DESKTOPBREAKPOINT: string = SASSCONSTANTS.AwakningBreakpointDesktop;

// Fix Hero Slide inner content element's vertical alignment during image downloading on desktop only
const viewportWidth: number = window.innerWidth;
const heroSlideElement: Ref<HTMLDivElement | null> = ref(null);

const heroSlidePlaceHolderHeight: ComputedRef<string> = computed(() => {
  return Math.round(viewportWidth / (16 / 9)) + "px";
});

const setHeroSlideElementHeight = (value: string) => {
  if (heroSlideElement.value) {
    heroSlideElement.value.style.height = value;
  }
};

const handlerHeroSlideImage = () => {
  if (!useIsOnMobile?.value) {
    setHeroSlideElementHeight("auto");
  }
};

onMounted(() => {
  if (!useIsOnMobile?.value) {
    setHeroSlideElementHeight(heroSlidePlaceHolderHeight.value);
  }
});
// end Fix Hero Slide inner content element's vertical alignment during image downloading on desktop only
</script>

<template>
  <div class="hero__slide" ref="heroSlideElement">
    <picture class="hero__slide-picture">
      <source
        :media="`(min-width: ${DESKTOPBREAKPOINT})`"
        :srcset="slide.images.desktop"
        data-testid="hero__slide-image-desktop"
      />
      <img
        :src="slide.images.mobile"
        :alt="slide.images.alt"
        class="hero__slide-image"
        data-testid="hero__slide-image"
        @load="handlerHeroSlideImage"
      />
    </picture>
    <div class="hero__slide-slick-slider">
      <span
        class="hero__slide-slick-slider-dot"
        v-for="(slide, index) in slidesLength"
        :class="{
          'hero__slide-slick-slider-dot--active': index === slideIndex,
        }"
        @click="$emit('display-selected-slide', index)"
        data-testid="hero__slide-slick-slider-dot"
      />
    </div>
    <div class="hero__slide-inner-content">
      <h3 class="hero__slide-subtitle" data-testid="hero__slide-subtitle">
        {{ slide.subtitle }}
      </h3>
      <h2 class="hero__slide-title" data-testid="hero__slide-title">
        {{ slide.title }}
      </h2>
      <RouterLink :to="slide.url" data-testid="hero__slide-link">
        <button class="btn btn--primary">explore now</button>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/_constants" as *;

.hero__slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  &-picture {
    width: 100%;
    text-align: center;
  }

  &-image {
    width: 100%;
    max-width: 640px;
    @media screen and (min-width: $AwakningBreakpointDesktop) {
      max-width: 100%;
    }
  }

  &-slick-slider {
    display: flex;
    gap: 10px;
    @media screen and (min-width: $AwakningBreakpointDesktop) {
      position: absolute;
      bottom: 20px;
    }
  }
  &-slick-slider-dot {
    display: block;
    width: 10px;
    height: 10px;
    border: 2px solid black;
    border-radius: 10px;
  }
  &-slick-slider-dot:hover {
    transform: scale(1.5);
    border-width: 1.5px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  &-slick-slider-dot--active {
    background-color: black;
  }

  &-inner-content {
    text-align: center;
    margin-top: 2rem;
    margin-bottom: 3rem;
    @media screen and (min-width: $AwakningBreakpointDesktop) {
      position: absolute;
      top: 36%;
      margin: 0;
      padding: 0;
    }
  }

  &-subtitle {
    font-size: 0.9375rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    line-height: 1.25;
    @media screen and (min-width: $AwakningBreakpointDesktop) {
      font-size: 1.125rem;
    }
  }

  &-title {
    margin: 10px 0 20px 0;
    font-size: 3.125rem;
    line-height: 1.25;
    @media screen and (min-width: $AwakningBreakpointDesktop) {
      font-size: 4rem;
    }
  }
}
</style>
