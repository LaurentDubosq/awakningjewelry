<script setup lang="ts">
import SASSCONSTANTS from "@/assets/styles/_constants.module.scss";
import type { HeroSlideType } from "@/types/components";
import { type PropType } from "vue";

const { slide, slidesLength, slideIndex, isActive } = defineProps({
  slide: { type: Object as PropType<HeroSlideType>, required: true },
  slidesLength: { type: Number, required: true },
  slideIndex: { type: Number, required: true },
  isActive: { type: Boolean, required: true },
});
const DESKTOPBREAKPOINT: string = SASSCONSTANTS.AwakningBreakpointDesktop;
</script>

<template>
  <div
    class="hero__slide"
    role="tabpanel"
    aria-roledescription="slide"
    :aria-label="`Slide ${slideIndex + 1} of ${slidesLength}`"
    :id="`slideshow-${slideIndex + 1}`"
  >
    <picture class="hero__slide-picture">
      <source
        :media="`(min-width: ${DESKTOPBREAKPOINT})`"
        :srcset="slide.images.desktop.url"
        data-testid="hero__slide-image-desktop"
      />
      <img
        :src="slide.images.mobile.url"
        :alt="slide.images.alt"
        class="hero__slide-image"
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
        :to="slide.url"
        class="btn btn--primary"
        :tabindex="isActive ? undefined : -1"
        data-testid="hero__slide-link"
      >
        explore now
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
