<script setup lang="ts">
import type { SiteMenuItem } from "@/data/menus";
import type { PropType } from "vue";

const { menuItem } = defineProps({
  menuItem: { type: Object as PropType<SiteMenuItem>, required: true },
});
</script>

<template>
  <menu class="site-nav__dropdown-list">
    <li
      class="site-nav__dropdown-list-item"
      v-for="subMenuItem in menuItem.subMenuItems"
    >
      <RouterLink
        class="site-nav__dropdown-link"
        :to="`${subMenuItem.url}`"
        @click="$emit('close-dropdown')"
      >
        {{ subMenuItem.title }}
      </RouterLink>
    </li>
  </menu>
</template>

<style scoped lang="scss">
@use "@/assets/styles/_constants.scss" as *;

.site-nav__dropdown {
  &-list {
    position: absolute;
    min-width: 100%; // Allows width to match content minimum and container minimum at the same time
    padding: 10px 0;
    background: $AwakningColorWhite;
    box-shadow: $AwakningBoxShadow;
    font-style: italic;
  }

  &-link {
    display: block;
    padding: 10px 15px;
    white-space: nowrap;
  }
}
</style>
