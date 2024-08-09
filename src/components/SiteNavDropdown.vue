<script setup lang="ts">
import type { SiteMenuItem } from "@/data/menus";
import { defineAsyncComponent, ref, type PropType, type Ref } from "vue";
import MyTransition from "./MyTransition.vue";
const SiteNavDropdownHeader = defineAsyncComponent(
  () => import("./SiteNavDropdownHeader.vue")
);
const SiteNavDropdownList = defineAsyncComponent(
  () => import("./SiteNavDropdownList.vue")
);

const { dropdown } = defineProps({
  dropdown: { type: Object as PropType<SiteMenuItem>, required: true },
});
const isDropdownOpen: Ref<boolean> = ref(false);

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}
</script>

<template>
  <div
    class="site-nav__dropdown"
    data-testid="site-nav__dropdown"
    @mouseenter="toggleDropdown"
    @mouseleave="toggleDropdown"
  >
    <SiteNavDropdownHeader :isDropdownOpen>
      {{ dropdown.title }}
    </SiteNavDropdownHeader>
    <MyTransition name="translateY">
      <SiteNavDropdownList
        :items="dropdown.subMenuItems"
        @close-dropdown="toggleDropdown"
        v-if="isDropdownOpen"
      />
    </MyTransition>
  </div>
</template>
