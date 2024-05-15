<script setup lang="ts">
import type { SiteMenuItem } from "@/data/menus";
import { ref, type PropType, type Ref } from "vue";
import SiteNavDropdownHeader from "./SiteNavDropdownHeader.vue";
import SiteNavDropdownList from "./SiteNavDropdownList.vue";
import MyTransition from "./MyTransition.vue";

const { menuItem } = defineProps({
  menuItem: { type: Object as PropType<SiteMenuItem>, required: true },
});
const isDropdownHovered: Ref<boolean> = ref(false);

function openDropdown() {
  isDropdownHovered.value = true;
}
function closeDropdown() {
  isDropdownHovered.value = false;
}
</script>

<template>
  <div
    class="site-nav__dropdown"
    @mouseenter="openDropdown"
    @mouseleave="closeDropdown"
    @click="closeDropdown"
  >
    <SiteNavDropdownHeader :isDropdownHovered="isDropdownHovered">
      {{ menuItem.title }}
    </SiteNavDropdownHeader>
    <MyTransition name="translateY">
      <SiteNavDropdownList
        :menuItem="menuItem"
        @close-dropdown="closeDropdown"
        v-if="isDropdownHovered"
      />
    </MyTransition>
  </div>
</template>
