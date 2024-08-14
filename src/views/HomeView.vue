<script setup lang="ts">
import { defineAsyncComponent } from "vue";

const Hero = defineAsyncComponent(() => import("@/components/Hero.vue"));
const CommentBar = defineAsyncComponent(
  () => import("@/components/CommentBar.vue")
);
const CollectionListing = defineAsyncComponent(
  () => import("@/components/CollectionListing.vue")
);
</script>

<template>
  <Hero />
  <CommentBar />
  <CollectionListing />
</template>
