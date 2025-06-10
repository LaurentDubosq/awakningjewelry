<script setup lang="ts">
import type { SiteMenuDropdown } from '@/types/components'
import { ref, type Ref } from 'vue'
import BurgerMenuDropdownButton from './BurgerMenuDropdownButton.vue'
import BurgerMenuDropdownList from './BurgerMenuDropdownList.vue'
import MyTransition from './MyTransition.vue'

const { dropdown } = defineProps<{
  dropdown: SiteMenuDropdown
}>()

const isDropdownOpen: Ref<boolean> = ref(true)
</script>

<template>
  <div class="burger-menu__dropdown" data-testid="burger-menu__dropdown">
    <BurgerMenuDropdownButton
      :text="dropdown.button.text"
      :isDropdownOpen
      @toggle-dropdown="isDropdownOpen = !isDropdownOpen"
    />
    <MyTransition name="vertical-top-slide" :group="true" :duration="300">
      <BurgerMenuDropdownList
        :links="dropdown.links"
        :id="dropdown.button.text"
        v-show="isDropdownOpen && dropdown.links"
      />
    </MyTransition>
  </div>
</template>
