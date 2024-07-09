<script setup lang="ts">
import type { SiteSubMenuItem } from "@/data/menus";
import type { PropType } from "vue";
import SiteNavDropdownItem from "./SiteNavDropdownItem.vue";

const { items } = defineProps({
  items: { type: Array as PropType<SiteSubMenuItem[]>, required: true },
});
</script>

<template>
  <menu class="site-nav__dropdown-list">
    <li
      class="site-nav__dropdown-list-item"
      data-testid="site-nav__dropdown-list-item"
      @click="$emit('close-dropdown')"
      v-for="item in items"
    >
      <RouterLink
        data-testid="site-nav__dropdown-list-item-link"
        :to="`${item.url}`"
      >
        <SiteNavDropdownItem>
          {{ item.title }}
        </SiteNavDropdownItem>
      </RouterLink>
    </li>
  </menu>
</template>

<style scoped lang="scss">
@use "@/assets/styles/_constants.scss" as *;

.site-nav__dropdown-list {
  position: absolute;
  min-width: 100%; // Allows width to match content minimum and container minimum at the same time
  padding: 10px 0;
  background: $AwakningColorWhite;
  box-shadow: $AwakningBoxShadow;
  font-style: italic;
}
</style>
