<script setup lang="ts">
import SASSCONSTANTS from '@/assets/styles/_constants.module.scss'
import type { HeroSlideType } from '@/types/components'

const { slide, slidesLength, slideIndex, isActive } = defineProps<{
  slide: HeroSlideType
  slidesLength: number
  slideIndex: number
  isActive: boolean
}>()
const BREAKPOINTMOBILELANDSCAPE: string = SASSCONSTANTS.BreakpointMobileLandscape
const BREAKPOINTDESKTOP: string = SASSCONSTANTS.BreakpointDesktop
const BREAKPOINTDESKTOPLARGE: string = SASSCONSTANTS.BreakpointDesktopLarge
</script>

<template>
  <div
    class="hero__slide"
    role="tabpanel"
    aria-roledescription="slide"
    :aria-label="`Slide ${slideIndex + 1} of ${slidesLength}`"
    :id="`slideshow-${slideIndex + 1}`"
    data-testid="hero__slide"
  >
    <picture class="hero__slide-picture">
      <source
        :media="`(min-width: ${BREAKPOINTDESKTOPLARGE})`"
        :srcset="slide.images.desktopLarge"
        data-testid="hero__slide-image-desktop-large"
      />
      <source
        :media="`(min-width: ${BREAKPOINTDESKTOP})`"
        :srcset="slide.images.desktop"
        data-testid="hero__slide-image-desktop"
      />
      <source
        :media="`(min-width: ${BREAKPOINTMOBILELANDSCAPE})`"
        :srcset="slide.images.mobileLandscape"
        data-testid="hero__slide-image-mobile-landscape"
      />
      <img
        class="hero__slide-image"
        :src="slide.images.mobile"
        :alt="slide.images.alt"
        loading="lazy"
        data-testid="hero__slide-image"
      />
    </picture>
    <div class="hero__slide-inner-content">
      <h3 class="hero__slide-subtitle" data-testid="hero__slide-subtitle">
        {{ slide.subtitle }}
      </h3>
      <h2 class="hero__slide-title" data-testid="hero__slide-title">
        {{ slide.title }}
      </h2>
      <RouterLink
        class="btn btn--primary"
        :to="slide.url"
        :tabindex="isActive ? undefined : -1"
        data-testid="hero__slide-link"
      >
        explore now
      </RouterLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants' as *;

.hero__slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  &-picture {
    text-align: center;
    @media screen and (min-width: $BreakpointDesktop) {
      width: 100%;
    }
  }

  &-image {
    width: 100%;
    max-width: 640px;
    @media screen and (min-width: $BreakpointDesktop) {
      max-width: 100%;
    }
  }

  &-inner-content {
    text-align: center;
    margin-top: 2rem;
    margin-bottom: 3rem;
    @media screen and (min-width: $BreakpointDesktop) {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      margin: 0;
      padding: 0;
    }
  }

  &-subtitle {
    font-size: 0.9375rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    line-height: 1.25;
    @media screen and (min-width: $BreakpointDesktop) {
      font-size: 1.125rem;
    }
  }

  &-title {
    margin: 10px 0 20px 0;
    font-size: 3.125rem;
    line-height: 1.25;
    @media screen and (min-width: $BreakpointDesktop) {
      font-size: 4rem;
    }
  }
}
</style>
