<script setup lang="ts">
import type { StatementBannerWording } from '@/types/components'
import type { FetchState } from '@/types/fetch'
import LoadingComponent from './LoadingComponent.vue'
import ErrorComponent from './ErrorComponent.vue'

/* As the component can be used multiple times in the application, its parent has the responsibility to fetch the data */
const { wording, wordingFetchState } = defineProps<{
  wording?: StatementBannerWording
  wordingFetchState?: FetchState
}>()
</script>

<template>
  <section
    class="statement-banner"
    aria-roledescription="statement banner"
    aria-labelledby="statement-banner__title"
  >
    <template v-if="wordingFetchState === 'fulfilled'">
      <h2
        class="statement-banner__title"
        id="statement-banner__title"
        aria-describedby="statement-banner__statement"
        data-testid="statement-banner__title"
      >
        {{ wording?.title }}
      </h2>
      <p
        class="statement-banner__statement"
        id="statement-banner__statement"
        data-testid="statement-banner__statement"
      >
        {{ wording?.statement }}
      </p>
      <img
        :src="wording?.image.url"
        :alt="wording?.image.alt"
        class="statement-banner__image"
        data-testid="statement-banner__image"
      />
    </template>
    <LoadingComponent v-if="wordingFetchState === 'pending'" />
    <ErrorComponent v-if="wordingFetchState === 'rejected'" />
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants.scss' as *;

.statement-banner {
  background-color: $AwakningColorPrimary;
  padding: 30px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: $AwakningColorSecondary;
  font-family: $AwakningFontArapey;

  &__title {
    font-family: $AwakningFontArapey;
    font-style: italic;
  }

  &__statement {
    max-width: 400px;
    text-align: center;
    text-transform: uppercase;
    font-size: 1.125rem;
  }

  &__image {
    margin-top: 10px;
    width: 32px;
  }
}
</style>
