<script setup lang="ts">
const { color } = defineProps({ color: { type: String, default: "" } });
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -960 960 960"
    data-testid="icon-play"
  >
    <path :fill="color" d="M372-294v-372l292 186-292 186Z" />
  </svg>
</template>
