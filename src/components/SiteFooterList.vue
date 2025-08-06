<script setup lang="ts">
import type { SiteFooterLink } from '@/types/features'
import SiteFooterItem from './SiteFooterItem.vue'

const { links } = defineProps<{ links: SiteFooterLink[] }>()
</script>

<template>
  <ul class="site-footer__list" data-testid="site-footer__list">
    <SiteFooterItem :link v-for="link in links" :key="link.id" />
  </ul>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants' as *;

.site-footer__list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  @media screen and (min-width: $breakpointDesktop) {
    align-items: flex-start;
    gap: 4px;
  }
}
</style>
