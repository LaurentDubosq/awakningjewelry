<script setup lang="ts">
import type { SiteFooterLink } from '@/types/features'

const { link } = defineProps<{ link: SiteFooterLink }>()

const isSocialLink = !!link.logo

const footerLinkBeforeClassObject = {
  'site-footer__list-item-link--before': isSocialLink,
  'site-footer__list-item-link-logo-facebook': link.logo === 'facebook',
}
</script>

<template>
  <li class="site-footer__list-item">
    <component
      class="site-footer__list-item-link"
      :class="footerLinkBeforeClassObject"
      :is="isSocialLink ? 'a' : 'router-link'"
      :href="link.url"
      :to="!isSocialLink ? link.url : null"
      :aria-label="link.alt"
      :title="link.title"
      :target="isSocialLink ? '_blank' : null"
      :rel="isSocialLink ? 'noopener' : null"
      :data-testid="
        isSocialLink ? 'site-footer__social-links-list-item-link' : 'site-footer__list-item-link'
      "
    >
      {{ link.text }}
    </component>
  </li>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants' as *;

.site-footer__list-item-link--before {
  display: flex;
  align-items: center;
  gap: 6px;

  @media screen and (min-width: $breakpointDesktop) {
    gap: 4px;
  }

  &::before {
    content: '';
    width: 20px;
    height: 20px;
  }
}

.site-footer__list-item-link-logo-facebook::before {
  background-image: url('/icons/facebook.svg');
}
</style>
