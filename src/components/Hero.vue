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
    aria-roledescription="carousel"
    aria-label="Highlighted our product categories"
    data-testid="hero"
  >
    <template v-if="fetchState === 'fulfilled'">
      <Slideshow :slidesLength v-if="slidesLength" v-slot="{ activeIndex }">
        <template v-for="(slide, index) in slides" :key="slide.id">
          <HeroSlide
            class="slideshow__slide"
            :class="{ 'slideshow__slide--active': index === activeIndex }"
            :slide
            :slidesLength
            :slideIndex="index"
            :isActive="index === activeIndex"
          />
        </template>
      </Slideshow>
    </template>
    <LoadingComponent v-if="fetchState === 'pending'" />
    <ErrorComponent v-if="fetchState === 'rejected'" />
  </section>
</template>
