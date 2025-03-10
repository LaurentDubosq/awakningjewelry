<script setup lang="ts">
const { color = '' } = defineProps<{ color: string }>()
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" data-testid="icon-pause">
    <path :fill="color" d="M560-252v-456h134v456H560Zm-294 0v-456h134v456H266Z" />
  </svg>
</template>
