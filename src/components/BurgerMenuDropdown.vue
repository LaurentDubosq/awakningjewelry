<script setup lang="ts">
import type { SiteMenuItem } from '@/types/components'
import { ref, type Ref, type PropType } from 'vue'
import BurgerMenuDropdownButton from './BurgerMenuDropdownButton.vue'
import BurgerMenuDropdownList from './BurgerMenuDropdownList.vue'
import MyTransition from './MyTransition.vue'

const { dropdown } = defineProps({
  dropdown: { type: Object as PropType<SiteMenuItem>, required: true },
})

const isDropdownOpen: Ref<boolean> = ref(true)
</script>

<template>
  <div class="burger-menu__dropdown" data-testid="burger-menu__dropdown">
    <BurgerMenuDropdownButton
      :text="dropdown.text"
      :isDropdownOpen
      @toggle-dropdown="isDropdownOpen = !isDropdownOpen"
    />
    <MyTransition name="margintopMinus100PerCentWithInner" :group="true" :duration="300">
      <BurgerMenuDropdownList
        :links="dropdown.subMenu"
        :dropdownText="dropdown.text"
        v-if="isDropdownOpen && dropdown.subMenu"
      />
    </MyTransition>
  </div>
</template>
