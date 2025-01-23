<script setup lang="ts">
import { getHeroSlides } from "@/data/dataFetchers";
import type { HeroSlideType } from "@/types/components";
import type { UseFetchWithStateReturn } from "@/types/fetch";
import type { FetchStatus } from "@/types/fetch";
import { computed, type ComputedRef } from "vue";
import Slideshow from "./Slideshow.vue";
import HeroSlide from "./HeroSlide.vue";
import LoadingComponent from "./LoadingComponent.vue";
import ErrorComponent from "./ErrorComponent.vue";

const slidesResult: UseFetchWithStateReturn<HeroSlideType[]> = getHeroSlides();

const slidesData: ComputedRef<HeroSlideType[] | undefined> = computed(
  () => slidesResult.data.value
);

const slidesDataLength: ComputedRef<number | undefined> = computed(
  () => slidesData.value?.length
);

const slidesFetchStatus: ComputedRef<FetchStatus | undefined> = computed(
  () => slidesResult?.status?.value
);
</script>

<template>
  <section
    class="hero"
    aria-roledescription="carousel"
    aria-label="Highlighted our product categories"
  >
    <template v-if="slidesFetchStatus === 'resolved'">
      <Slideshow
        :slidesDataLength
        v-if="slidesDataLength"
        v-slot="{ currentIndex }"
      >
        <template v-for="(slide, index) in slidesData" :key="slide.id">
          <HeroSlide
            :slide
            :slidesDataLength
            :slideIndex="index"
            :isActive="index === currentIndex"
            v-show="index === currentIndex"
          />
        </template>
      </Slideshow>
    </template>
    <LoadingComponent v-if="slidesFetchStatus === 'pending'" />
    <ErrorComponent v-if="slidesFetchStatus === 'rejected'" />
  </section>
</template>
