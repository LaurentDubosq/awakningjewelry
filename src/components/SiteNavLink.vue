<script setup lang="ts">
import type { SiteMenuLink } from '@/types/features'
import SiteHeaderIcon from './SiteHeaderIcon.vue'

const { link } = defineProps<{
  link: SiteMenuLink
}>()
</script>

<template>
  <RouterLink
    :class="[
      'site-nav__link',
      {
        'site-nav__link--text': link.type === 'textLink',
        'site-nav__link--icon': link.type === 'iconLink',
      },
    ]"
    :to="link.url"
    :title="link.title"
    :data-testid="
      (link.type === 'textLink' && 'site-nav__link--text') ||
      (link.type === 'iconLink' && 'site-nav__link--icon')
    "
  >
    <template v-if="link.type === 'textLink'">
      {{ link.text }}
    </template>
    <template v-else-if="link.type === 'iconLink'">
      <SiteHeaderIcon :alternative-text="link.text">
        <slot />
      </SiteHeaderIcon>
    </template>
  </RouterLink>
</template>

<style lang="scss">
@use '@/assets/styles/_constants.scss' as *;

/* The current style tag is unscoped to allow SiteNavDropdownButton to use the "site-nav__link--text" CSS class */
.site-nav__link--text {
  padding: $siteNavLinkPaddingX;
  font-family: $AwakningFontMontserrat;
  font-weight: 500;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
</style>
