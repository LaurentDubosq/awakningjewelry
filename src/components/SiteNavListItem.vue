<script setup lang="ts">
import type { siteMenuItem } from "@/data/menus";
import SiteHeaderIconLink from "./SiteHeaderIconLink.vue";
import PersonIcon from "./icons/IconPerson.vue";
import SiteNavTextLink from "./SiteNavTextLink.vue";
import SiteNavTextDropdown from "./SiteNavTextDropdown.vue";

const { link } = defineProps({
  link: { type: Object as () => siteMenuItem, required: true },
});
</script>

<template>
  <li class="site-nav__list-item">
    <template v-if="link.type === 'text'">
      <SiteNavTextLink
        :link="link"
        @click="$emit('selected-menu-item', link.title)"
        v-if="!link.subSiteMenuItems"
      />
      <SiteNavTextDropdown :link="link" v-else-if="link.subSiteMenuItems" />
    </template>
    <template v-else-if="link.type === 'icon'">
      <SiteHeaderIconLink url="/account">
        <PersonIcon />
      </SiteHeaderIconLink>
    </template>
  </li>
</template>

<style lang="scss">
@use "@/assets/styles/_constants.scss" as *;

.site-nav__list-item {
  position: relative;
}

/* This CSS has been created here to be used both in SiteNavTextLink and SiteNavTextDropdown component */
.site-nav__list-item-title {
  padding: $siteNavListItemTitlePaddingX;
  font-family: $Montserrat;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
</style>
