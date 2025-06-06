<script setup lang="ts">
import Slideshow from './Slideshow.vue'
import HeroSlide from './HeroSlide.vue'
import LoadingComponent from './LoadingComponent.vue'
import ErrorComponent from './ErrorComponent.vue'
import { useHeroSlidesResultStore } from '@/stores/heroSlides'
import { storeToRefs } from 'pinia'

// Get the store instance
const heroSlidesStore = useHeroSlidesResultStore()

// Get the store's states and computeds
const {
  heroSlidesData: slides,
  heroSlidesDataLength: slidesLength,
  heroSlidesFetchState: fetchState,
} = storeToRefs(heroSlidesStore)
</script>

<template>
  <section
    class="hero"
    aria-roledescription="carousel"
    aria-label="Highlighted our product categories"
  >
    <template v-if="fetchState === 'fulfilled'">
      <Slideshow :slidesLength v-if="slidesLength" v-slot="{ currentIndex }">
        <template v-for="(slide, index) in slides" :key="slide.id">
          <HeroSlide
            class="slideshow__slide"
            :class="{ 'slideshow__slide--active': index === currentIndex }"
            :slide
            :slidesLength
            :slideIndex="index"
            :isActive="index === currentIndex"
          />
        </template>
      </Slideshow>
    </template>
    <LoadingComponent v-if="fetchState === 'pending'" />
    <ErrorComponent v-if="fetchState === 'rejected'" />
  </section>
</template>
