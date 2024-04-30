<script setup lang="ts">
import type { siteMenuItem } from "@/data/menus";
import { ref } from "vue";
import MyTransition from "./MyTransition.vue";

const { link } = defineProps({
  link: { type: Object as () => siteMenuItem, required: true },
});

const isTextDropdownHovered = ref(false);
</script>

<template>
  <div
    class="site-nav__text-dropdown"
    @mouseenter="isTextDropdownHovered = true"
    @mouseleave="isTextDropdownHovered = false"
  >
    <div
      class="site-nav__text-dropdown-title site-nav__list-item-title flex items-center"
      :class="{ 'site-nav__text-dropdown-title--hover': isTextDropdownHovered }"
    >
      {{ link.title }}
      <span class="site-nav__text-dropdown-title-icon">
        <template v-if="isTextDropdownHovered">▲</template>
        <template v-else>▼</template></span
      >
    </div>
    <MyTransition name="translateY">
      <menu class="site-nav__text-dropdown-list" v-if="isTextDropdownHovered">
        <li
          class="site-nav__text-dropdown-item"
          v-for="sublink in link.subSiteMenuItems"
        >
          <RouterLink
            class="site-nav__text-dropdown-link no-wrap"
            :to="`${sublink.url}`"
            @click="isTextDropdownHovered = false"
          >
            {{ sublink.title }}
          </RouterLink>
        </li>
      </menu>
    </MyTransition>
  </div>
</template>

<style lang="scss">
@use "@/assets/styles/_constants.scss" as *;

.site-nav__text-dropdown {
  &-title--hover {
    background-color: $White;
    box-shadow: $BoxShadowStandard;

    &::after {
      content: "";
      position: absolute;
      width: calc(100% - ($siteNavListItemTitlePaddingX * 2));
      height: 1px;
      background-color: $AwakningBlack;
      bottom: 0;
      z-index: 1;
    }
  }

  &-list {
    position: absolute;
    min-width: 100%;
    padding: 10px 0;
    background: $White;
    box-shadow: $BoxShadowStandard;
    font-style: italic;
  }

  &-link {
    display: block;
    padding: 10px 15px;
  }

  &-title-icon {
    font-size: 0.625rem;
    margin-left: 4px;
  }
}
</style>
