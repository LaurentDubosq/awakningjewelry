<script setup lang="ts">
import type { SiteMenuDropdown } from '@/types/features'
import { provide, ref, type Ref } from 'vue'
import MyTransition from './MyTransition.vue'
import { closeDropdownKey } from '@/utils/injectionkeys'
import SiteNavDropdownButton from './SiteNavDropdownButton.vue'
import SiteNavDropdownList from './SiteNavDropdownList.vue'
import useExecuteWhenFocusMovesOutside from '@/composables/useExecuteWhenFocusMovesOutside'

const { dropdown } = defineProps<{
  dropdown: SiteMenuDropdown
}>()

const isDropdownOpen: Ref<boolean> = ref(false)

const openDropdown = () => {
  isDropdownOpen.value = true
}
const closeDropdown = () => {
  isDropdownOpen.value = false
}
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

/* Send "closeDropdown" function to the dropdown item component */
provide(closeDropdownKey, closeDropdown)
</script>

<template>
  <div
    class="site-nav__dropdown"
    @mouseenter="openDropdown"
    @mouseleave="closeDropdown"
    @focusout="(event) => useExecuteWhenFocusMovesOutside(event, closeDropdown)"
    @keydown.escape="closeDropdown"
    data-testid="site-nav__dropdown"
  >
    <SiteNavDropdownButton
      v-bind="dropdown.button"
      :is-dropdown-open
      @open-dropdown="openDropdown"
      @toggle-dropdown="toggleDropdown"
    />
    <MyTransition name="vertical-top-subtle-slide" :group="false">
      <SiteNavDropdownList
        :links="dropdown.links"
        :id="dropdown.button.text"
        v-show="isDropdownOpen && dropdown.links"
      />
    </MyTransition>
  </div>
</template>
