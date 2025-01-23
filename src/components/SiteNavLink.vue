<script setup lang="ts">
import { type PropType } from "vue";
import type { SiteMenuItem } from "@/types/components";
import SiteHeaderIcon from "./SiteHeaderIcon.vue";

const { link } = defineProps({
  link: { type: Object as PropType<SiteMenuItem>, required: true },
});
</script>

<template>
  <RouterLink
    :class="[
      'site-nav__link',
      {
        'site-nav__link--text': link.type === 'text',
        'site-nav__link--icon': link.type === 'icon',
      },
    ]"
    :to="link.url"
    :title="link.title"
    :data-testid="
      (link.type === 'text' && 'site-nav__link--text') ||
      (link.type === 'icon' && 'site-nav__link--icon')
    "
  >
    <template v-if="link.type === 'text'">
      {{ link.text }}
    </template>
    <template v-else-if="link.type === 'icon'">
      <SiteHeaderIcon :alternativeText="link.text">
        <slot />
      </SiteHeaderIcon>
    </template>
  </RouterLink>
</template>

<style lang="scss">
@use "@/assets/styles/_constants.scss" as *;

/* The current style tag is unscoped to allow SiteNavDropdownButton to use the "site-nav__link--text" CSS class */
.site-nav__link--text {
  padding: $siteNavLinkPaddingX;
  font-family: $AwakningFontMontserrat;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
</style>
