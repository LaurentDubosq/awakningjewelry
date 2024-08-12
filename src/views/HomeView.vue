<script setup lang="ts">
import { defineAsyncComponent } from "vue";

const Hero = defineAsyncComponent(() => import("@/components/Hero.vue"));
const CommentBar = defineAsyncComponent(
  () => import("@/components/CommentBar.vue")
);
</script>

<template>
  <Hero />
  <CommentBar />
</template>
