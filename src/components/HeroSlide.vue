<script setup lang="ts">
import SASSCONSTANTS from "@/assets/styles/_constants.module.scss";
import type { HeroSlideType } from "@/data/components";
import type { PropType } from "vue";

const { displayedSlideIndex, slide, slidesLength } = defineProps({
  displayedSlideIndex: { type: Number, required: true },
  slide: { type: Object as PropType<HeroSlideType>, required: true },
  slidesLength: {
    type: [Number, undefined] as PropType<number | undefined>,
    required: true,
  },
});
const DESKTOPBREAKPOINT: string = SASSCONSTANTS.AwakningBreakpointDesktop;
</script>

<template>
  <div class="hero__slide">
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
      />
    </picture>
    <div class="hero__slide-slick-slider">
      <span
        class="hero__slide-slick-slider-dot"
        v-for="(slide, index) in slidesLength"
        :class="{
          'hero__slide-slick-slider-dot--selected':
            index === displayedSlideIndex,
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

<style lang="scss">
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
  &-slick-slider-dot--selected {
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
