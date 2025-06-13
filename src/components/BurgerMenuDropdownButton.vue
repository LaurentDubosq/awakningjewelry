<script setup lang="ts">
import IconSignMinus from './icons/IconSignMinus.vue'
import IconSignPlus from './icons/IconSignPlus.vue'

const { text, isDropdownOpen } = defineProps<{
  text: string
  isDropdownOpen: boolean
}>()

const id = text.toLowerCase()
</script>

<template>
  <button
    class="burger-menu__dropdown-button burger-menu__link"
    :id="`burger-menu__dropdown-button-${id}`"
    @click="$emit('toggle-dropdown')"
    :aria-expanded="isDropdownOpen ? 'true' : 'false'"
    :aria-controls="`burger-menu__dropdown-list-${id}`"
    data-testid="burger-menu__dropdown-button"
  >
    {{ text }}
    <span
      class="burger-menu__dropdown-button-icon-wrapper"
      aria-hidden="true"
      data-testid="burger-menu__dropdown-button-icon-wrapper"
    >
      <IconSignMinus class="burger-menu__dropdown-button-icon" width="27" v-show="isDropdownOpen" />
      <IconSignPlus class="burger-menu__dropdown-button-icon" width="27" v-show="!isDropdownOpen" />
    </span>
  </button>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants.scss' as *;

.burger-menu__dropdown-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  &-icon {
    fill: $AwakningColorSecondary;
  }
}
</style>
