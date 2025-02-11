<template>
  <div class="loader-wrapper" role="status" aria-live="polite">
    <span class="loader" aria-hidden="true"></span>
    <span class="sr-only">Loading, please wait...</span>
  </div>
</template>

<style lang="scss">
@use '@/assets/styles/_constants.scss' as *;

.loader-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5px;
}

.loader {
  width: 20px;
  height: 20px;
  border: 2px solid $AwakningColorBlack;
  border-bottom-color: $AwakningColorWhite;
  border-radius: 50%;
  display: inline-block;
  animation: rotation 1s linear infinite;
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
