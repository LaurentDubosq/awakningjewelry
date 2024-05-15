<script setup lang="ts">
import SASSCONSTANTS from "@/assets/styles/_constants.module.scss";
import IconSignMinus from "./icons/IconSignMinus.vue";
import IconSignPlus from "./icons/IconSignPlus.vue";

const { title, isTextDropdownOpen } = defineProps({
  title: { type: String, required: true },
  isTextDropdownOpen: { type: Boolean, required: true },
});
const COLORWHITE: string = SASSCONSTANTS.AwakningColorWhite; // To set the color of the Plus/Minus Icon correctly, we get the desire color from the design system.
</script>

<template>
  <header class="burger-menu__dropdown-header">
    <div class="burger-menu__dropdown-title burger-menu__link">
      {{ title }}
    </div>
    <button
      class="burger-menu__dropdown-icon-area"
      @click="$emit('toggle-dropdown')"
    >
      <div class="burger-menu__dropdown-icon-size">
        <IconSignMinus :color="COLORWHITE" v-if="isTextDropdownOpen" />
        <IconSignPlus :color="COLORWHITE" v-else />
      </div>
    </button>
  </header>
</template>

<style scoped lang="scss">
.burger-menu__dropdown {
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &-icon-area {
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &-icon-size {
    display: flex;
    width: 27px;
  }
}
</style>
