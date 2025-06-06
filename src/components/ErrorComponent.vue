<template>
  <p class="error-message" role="alert" data-testid="error-message">
    Loading error, please reload the page.
  </p>
</template>

<style lang="scss">
@use '@/assets/styles/_constants.scss' as *;

.error-message {
  color: $AwakningPermanentColorError;
  margin: 0 5px;
}
</style>
