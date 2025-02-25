<script setup lang="ts">
import { getHeroSlides } from '@/data/dataFetchers'
import type { HeroSlideType } from '@/types/components'
import type { UseFetchWithStateReturn } from '@/types/fetch'
import Slideshow from './Slideshow.vue'
import HeroSlide from './HeroSlide.vue'
import LoadingComponent from './LoadingComponent.vue'
import ErrorComponent from './ErrorComponent.vue'
import { useHeroSlidesResultStore } from '@/stores/heroSlides'
import { storeToRefs } from 'pinia'

// Get the store instance
const heroSlidesStore = useHeroSlidesResultStore()

// Get the store's states, computeds and methods
const {
  heroSlidesResult,
  heroSlidesData: slides,
  heroSlidesDataLength: slidesLength,
  heroSlidesFetchStatus: fetchStatus,
} = storeToRefs(heroSlidesStore)
const { updateHeroSlidesResult } = heroSlidesStore

// Don't fetch the data if the data already exists in the store (for performance reason)
if (!heroSlidesResult.value) {
  // Get the data fetch result
  const result: UseFetchWithStateReturn<HeroSlideType[]> = getHeroSlides()

  // Update the store with the result
  updateHeroSlidesResult(result)
}
</script>

<template>
  <section
    class="hero"
    aria-roledescription="carousel"
    aria-label="Highlighted our product categories"
  >
    <template v-if="fetchStatus === 'resolved'">
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
    <LoadingComponent v-if="fetchStatus === 'pending'" />
    <ErrorComponent v-if="fetchStatus === 'rejected'" />
  </section>
</template>
