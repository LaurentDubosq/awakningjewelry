<!-- This component has attached documentation. This concerns a11y label reading. Find it at docs/features/HeroSlide.md -->

<script setup lang="ts">
import sassConstants from '@/assets/styles/_constants.module.scss'
import type { HeroSlideType } from '@/types/features'

const { slide, slideIndex, isActive } = defineProps<{
  slide: HeroSlideType
  slideIndex: number
  slidesLength: number
  isActive: boolean
  isSlideLabelSRReadable?: boolean
}>()
const breakpointMobileLandscape: string = sassConstants.breakpointMobileLandscape
const breakpointDesktop: string = sassConstants.breakpointDesktop
const breakpointDesktopLarge: string = sassConstants.breakpointDesktopLarge
</script>

<template>
  <div
    class="hero__slide"
    role="tabpanel"
    aria-labelledby="hero__slide-title hero__slide-subtitle"
    :aria-roledescription="`Slide ${slideIndex + 1} of ${slidesLength}`"
    :id="`slideshow-${slideIndex + 1}`"
    data-testid="hero__slide"
  >
    <div
      class="hero__slide-a11y-label sr-only"
      v-show="isSlideLabelSRReadable"
      data-testid="hero__slide-a11y-label"
    >
      Slide {{ slideIndex + 1 }} of {{ slidesLength }}
    </div>
    <h2 class="hero__slide-title" data-testid="hero__slide-title">
      {{ slide.title }}
    </h2>
    <h3 class="hero__slide-subtitle" data-testid="hero__slide-subtitle">
      {{ slide.subtitle }}
    </h3>
    <picture class="hero__slide-picture">
      <source
        :media="`(min-width: ${breakpointDesktopLarge})`"
        :srcset="slide.images.desktopLarge"
        data-testid="hero__slide-image-desktop-large"
      />
      <source
        :media="`(min-width: ${breakpointDesktop})`"
        :srcset="slide.images.desktop"
        data-testid="hero__slide-image-desktop"
      />
      <source
        :media="`(min-width: ${breakpointMobileLandscape})`"
        :srcset="slide.images.mobileLandscape"
        data-testid="hero__slide-image-mobile-landscape"
      />
      <img
        class="hero__slide-image"
        :src="slide.images.mobile"
        :alt="slide.imageAlt"
        data-testid="hero__slide-image"
      />
    </picture>
    <RouterLink
      class="hero__slide-link btn btn--primary"
      :to="slide.url"
      @touchstart.stop
      @touchend.stop
      :tabindex="isActive ? undefined : -1"
      data-testid="hero__slide-link"
    >
      explore now
    </RouterLink>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants' as *;

.hero__slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0 15px;
  @media screen and (min-width: $breakpointDesktop) {
    justify-content: center;
    aspect-ratio: 1600/900;
  }

  &-title {
    text-align: center;
    margin: 10px 0 20px 0;
    font-size: 3.125rem;
    line-height: 1.25;
    order: 2;
    @media screen and (min-width: $breakpointDesktop) {
      position: relative;
      z-index: 1;
      font-size: 4rem;
    }
  }

  &-subtitle {
    text-align: center;
    font-size: 0.9375rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    line-height: 1.25;
    order: 1;
    margin-top: 2rem;
    @media screen and (min-width: $breakpointDesktop) {
      position: relative;
      z-index: 1;
      font-size: 1.125rem;
    }
  }

  &-picture {
    aspect-ratio: 640/640;
    width: 100%;
    order: 0;
    @media screen and (min-width: $breakpointDesktop) {
      position: absolute;
      width: 100%;
      aspect-ratio: 1600/900;
    }
  }

  &-image {
    width: 100%;
    max-width: 640px;
    @media screen and (min-width: $breakpointDesktop) {
      max-width: 100%;
    }
  }

  &-link {
    margin-bottom: 3rem;
    order: 3;
    @media screen and (min-width: $breakpointDesktop) {
      position: relative;
      z-index: 1;
    }
  }
}
</style>
