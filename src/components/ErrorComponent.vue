<template>
  <p class="error-message" role="alert" aria-live="assertive">
    Loading error, please reload the page.
  </p>
</template>

<style lang="scss">
@use '@/assets/styles/_constants.scss' as *;

.error-message {
  color: $AwakningColorError;
  margin: 0 5px;
}
</style>
