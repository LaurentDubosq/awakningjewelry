<script setup lang="ts">
import Slideshow from './Slideshow.vue'
import HeroSlide from './HeroSlide.vue'
import LoadingComponent from './LoadingComponent.vue'
import ErrorComponent from './ErrorComponent.vue'
import { useHeroSlidesStore } from '@/stores/heroSlides'
import { storeToRefs } from 'pinia'

// Get the store instance
const heroSlidesStore = useHeroSlidesStore()

// Get the store's states and computeds
const {
  heroSlides: slides,
  heroSlidesLength: slidesLength,
  heroSlidesFetchState: fetchState,
} = storeToRefs(heroSlidesStore)
</script>

<template>
  <section
    class="hero"
    aria-label="Product categories"
    aria-roledescription="carousel"
    data-testid="hero"
  >
    <template v-if="fetchState === 'fulfilled'">
      <Slideshow :slides-length v-if="slidesLength" v-slot="{ activeIndex }">
        <template v-for="(slide, index) in slides" :key="slide.id">
          <HeroSlide
            class="slideshow__slide"
            :class="{ 'slideshow__slide--active': index === activeIndex }"
            :slide
            :slides-length
            :slide-index="index"
            :is-active="index === activeIndex"
          />
        </template>
      </Slideshow>
    </template>
    <LoadingComponent v-else-if="fetchState === 'pending'" />
    <ErrorComponent v-else-if="fetchState === 'rejected'" />
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants.scss' as *;

.hero {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 548px;
  @media screen and (min-width: $breakpointDesktop) {
    min-height: 0;
    aspect-ratio: 1600/900;
  }
}
</style>
