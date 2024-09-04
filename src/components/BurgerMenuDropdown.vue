<script setup lang="ts">
import type { SiteMenuItem } from "@/data/menus";
import { ref, type Ref, type PropType } from "vue";
import BurgerMenuDropdownHeader from "./BurgerMenuDropdownHeader.vue";
import BurgerMenuDropdownList from "./BurgerMenuDropdownList.vue";
import MyTransition from "./MyTransition.vue";

const { dropdown } = defineProps({
  dropdown: { type: Object as PropType<SiteMenuItem>, required: true },
});

const isDropdownOpen: Ref<boolean> = ref(true);
</script>

<template>
  <div class="burger-menu__dropdown">
    <BurgerMenuDropdownHeader
      :isDropdownOpen
      @toggle-dropdown="isDropdownOpen = !isDropdownOpen"
    >
      {{ dropdown.title }}
    </BurgerMenuDropdownHeader>
    <MyTransition :duration="300" name="margintopMinus100PerCentWithInner">
      <BurgerMenuDropdownList
        :items="dropdown.subMenuItems"
        v-if="isDropdownOpen"
      />
    </MyTransition>
  </div>
</template>
