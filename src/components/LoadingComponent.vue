<template>
  <div class="loader" role="status" aria-live="polite">
    <span class="loader__animation" aria-hidden="true" data-testid="loader__animation"></span>
    <span class="loader__alternative-text sr-only" data-testid="loader__alternative-text"
      >Loading, please wait...</span
    >
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants.scss' as *;

.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5px;

  &__animation {
    width: 20px;
    height: 20px;
    border: 2px solid $AwakningColorPrimary;
    border-bottom-color: $AwakningColorSecondary;
    border-radius: 50%;
    display: inline-block;
    animation: rotation 1s linear infinite;
  }
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
