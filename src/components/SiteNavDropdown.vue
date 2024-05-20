<script setup lang="ts">
import type { SiteMenuItem } from "@/data/menus";
import { ref, type PropType, type Ref } from "vue";
import SiteNavDropdownHeader from "./SiteNavDropdownHeader.vue";
import SiteNavDropdownList from "./SiteNavDropdownList.vue";
import MyTransition from "./MyTransition.vue";

const { menuItem } = defineProps({
  menuItem: { type: Object as PropType<SiteMenuItem>, required: true },
});
const isDropdownOpen: Ref<boolean> = ref(false);

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}
</script>

<template>
  <div
    class="site-nav__dropdown"
    @mouseenter="toggleDropdown"
    @mouseleave="toggleDropdown"
  >
    <SiteNavDropdownHeader :isDropdownOpen="isDropdownOpen">
      {{ menuItem.title }}
    </SiteNavDropdownHeader>
    <MyTransition name="translateY">
      <SiteNavDropdownList
        :menuItem="menuItem"
        @close-dropdown="toggleDropdown"
        v-if="isDropdownOpen"
      />
    </MyTransition>
  </div>
</template>
