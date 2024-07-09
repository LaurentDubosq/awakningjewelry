<template>
  <span class="burger-menu__item">
    <slot />
  </span>
</template>

<style lang="scss">
@use "@/assets/styles/_constants.scss" as *;

/* This style is unscoped to allow BurgerMenuDropdownHeader and BurgerMenuDropdownList to use it also */
.burger-menu__link {
  display: block;
  padding: 15px;
  font-size: 1.375rem;
  color: $AwakningColorWhite;
}
</style>
