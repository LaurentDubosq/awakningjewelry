<script setup lang="ts">
import IconSignMinus from './icons/IconSignMinus.vue'
import IconSignPlus from './icons/IconSignPlus.vue'

const { text, isDropdownOpen } = defineProps<{
  text: string
  isDropdownOpen: boolean
}>()

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
      <IconSignMinus class="burger-menu__dropdown-button-icon" width="27" v-if="isDropdownOpen" />
      <IconSignPlus class="burger-menu__dropdown-button-icon" width="27" v-else />
    </span>
  </button>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants.scss' as *;

.burger-menu__dropdown-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%; // Force width to 100% because the native button display (inline-block) remains despite display flex

  &-icon {
    fill: $AwakningPermanentColorWhite;
  }
}
</style>
