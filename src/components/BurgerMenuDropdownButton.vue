<script setup lang="ts">
import SASSCONSTANTS from '@/assets/styles/_constants.module.scss'
import IconSignMinus from './icons/IconSignMinus.vue'
import IconSignPlus from './icons/IconSignPlus.vue'

const { text, isDropdownOpen } = defineProps<{
  text: string
  isDropdownOpen: boolean
}>()

const COLORWHITE: string = SASSCONSTANTS.AwakningColorWhite // Set plus/minus icon color from design system
const textLowered = text.toLowerCase()
</script>

<template>
  <button
    class="burger-menu__dropdown-button burger-menu__link"
    @click="$emit('toggle-dropdown')"
    :aria-expanded="isDropdownOpen ? 'true' : 'false'"
    :aria-controls="`burger-menu__dropdown-list-${textLowered}`"
    :id="`burger-menu__dropdown-button-${textLowered}`"
    data-testid="burger-menu__dropdown-button"
  >
    {{ text }}
    <span class="burger-menu__dropdown-button-icon-wrapper" aria-hidden="true">
      <IconSignMinus width="27" :color="COLORWHITE" v-if="isDropdownOpen" />
      <IconSignPlus width="27" :color="COLORWHITE" v-else />
    </span>
  </button>
</template>

<style scoped lang="scss">
.burger-menu__dropdown-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%; // Force width to 100% because the native button display (inline-block) remains despite display flex
}
</style>
