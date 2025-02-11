<script setup lang="ts">
import type { SiteMenuItem } from '@/types/components'
import { provide, ref, type Ref, type PropType } from 'vue'
import MyTransition from './MyTransition.vue'
import { closeSiteNavDropdownKey } from '@/utils/injectionkeys'
import SiteNavDropdownButton from './SiteNavDropdownButton.vue'
import SiteNavDropdownList from './SiteNavDropdownList.vue'
import useExecuteOnFocusLeave from '@/composables/useExecuteOnFocusLeave'

const { dropdown } = defineProps({
  dropdown: { type: Object as PropType<SiteMenuItem>, required: true },
})

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
    <SiteNavDropdownButton
      :text="dropdown.text"
      :title="dropdown.title"
      :isDropdownOpen
      @open-dropdown="openDropdown"
    />
    <MyTransition name="translateY" :group="true">
      <SiteNavDropdownList
        :links="dropdown.subMenu"
        :dropdownText="dropdown.text"
        v-if="isDropdownOpen && dropdown.subMenu"
      />
    </MyTransition>
  </div>
</template>
