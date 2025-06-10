<script setup lang="ts">
import type { SiteMenuDropdown } from '@/types/components'
import { provide, ref, type Ref } from 'vue'
import MyTransition from './MyTransition.vue'
import { closeSiteNavDropdownKey } from '@/utils/injectionkeys'
import SiteNavDropdownButton from './SiteNavDropdownButton.vue'
import SiteNavDropdownList from './SiteNavDropdownList.vue'
import useExecuteOnFocusLeave from '@/composables/useExecuteOnFocusLeave'

const { dropdown } = defineProps<{
  dropdown: SiteMenuDropdown
}>()

const isDropdownOpen: Ref<boolean> = ref(false)

function openDropdown() {
  isDropdownOpen.value = true
}
function closeDropdown() {
  isDropdownOpen.value = false
}

/* Send "closeDropdown" function to the dropdown item component */
provide(closeSiteNavDropdownKey, closeDropdown)
</script>

<template>
  <div
    class="site-nav__dropdown"
    @mouseenter="openDropdown"
    @mouseleave="closeDropdown"
    @focusout="(event) => useExecuteOnFocusLeave(event, closeDropdown)"
    @keydown.escape="closeDropdown"
    data-testid="site-nav__dropdown"
  >
    <SiteNavDropdownButton v-bind="dropdown.button" :isDropdownOpen @open-dropdown="openDropdown" />
    <MyTransition name="vertical-top-subtle-slide" :group="true">
      <SiteNavDropdownList
        :links="dropdown.links"
        :id="dropdown.button.text"
        v-if="isDropdownOpen && dropdown.links"
      />
    </MyTransition>
  </div>
</template>
