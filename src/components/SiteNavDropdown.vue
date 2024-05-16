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

function openDropdown() {
  isDropdownOpen.value = true;
}
function closeDropdown() {
  isDropdownOpen.value = false;
}
</script>

<template>
  <!-- "mouseenter" and "mouseleave" are used for mouse navigation / "touchestart.prevent" for touch navigation -->
  <!-- We avoid using a toggle for all events, as touchstart with the passive option triggers an unwanted mouseenter event -->
  <div
    class="site-nav__dropdown"
    @mouseenter="openDropdown"
    @mouseleave="closeDropdown"
    @touchstart.passive="openDropdown"
  >
    <SiteNavDropdownHeader :isDropdownOpen="isDropdownOpen">
      {{ menuItem.title }}
    </SiteNavDropdownHeader>
    <MyTransition name="translateY">
      <SiteNavDropdownList
        :menuItem="menuItem"
        @close-dropdown="closeDropdown"
        v-if="isDropdownOpen"
      />
    </MyTransition>
  </div>
</template>
