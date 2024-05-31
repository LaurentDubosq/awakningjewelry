<template>
  <div type="button" class="site-header__icon">
    <div class="site-header__icon-size">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.site-header__icon {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;

  &-size {
    width: 27px;
  }
}
</style>
