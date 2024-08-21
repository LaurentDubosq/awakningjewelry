<script setup lang="ts">
import { getHeroSlides } from "@/composables/fetch";
import type { Slide } from "@/data/components";
import { defineAsyncComponent, onMounted, ref, type Ref } from "vue";

const SlideShow = defineAsyncComponent(() => import("./SlideShow.vue"));

const slides: Ref<Slide[] | undefined> = ref(undefined);

onMounted(async () => {
  slides.value = await getHeroSlides();
});
</script>

<template>
  <section class="hero">
    <SlideShow :slides />
  </section>
</template>
