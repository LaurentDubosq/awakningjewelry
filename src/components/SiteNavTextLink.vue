<script setup lang="ts">
import type { siteMenuItem } from "@/data/menus";

const { link } = defineProps({
  link: { type: Object as () => siteMenuItem, required: true },
});
</script>

<template>
  <RouterLink
    class="site-nav__text-link site-nav__list-item-title"
    :to="`${link.url}`"
  >
    {{ link.title }}
  </RouterLink>
</template>
