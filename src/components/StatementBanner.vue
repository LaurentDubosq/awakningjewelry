<script setup lang="ts">
import type { StatementBanner } from '@/types/components'
import type { FetchStatus } from '@/types/fetch'
import LoadingComponent from './LoadingComponent.vue'
import ErrorComponent from './ErrorComponent.vue'
import { type PropType } from 'vue'

/* As the component can be used multiple times in the application, its parent has the responsibility to fetch the data */
const { statement, fetchStatus } = defineProps({
  statement: {
    type: Object as PropType<StatementBanner> | undefined,
  },
  fetchStatus: {
    type: String as PropType<FetchStatus> | undefined,
  },
})
</script>

<template>
  <section
    class="statement-banner"
    aria-roledescription="statement banner"
    aria-labelledby="statement-banner__title"
  >
    <template v-if="fetchStatus === 'resolved'">
      <h2
        class="statement-banner__title"
        id="statement-banner__title"
        aria-describedby="statement-banner__text"
        data-testid="statement-banner__title"
      >
        {{ statement?.title }}
      </h2>
      <p
        class="statement-banner__text"
        id="statement-banner__text"
        data-testid="statement-banner__text"
      >
        {{ statement?.text }}
      </p>
      <img
        :src="statement?.image.url"
        :alt="statement?.image.alt"
        class="statement-banner__image"
        data-testid="statement-banner__image"
      />
    </template>
    <LoadingComponent v-if="fetchStatus === 'pending'" />
    <ErrorComponent v-if="fetchStatus === 'rejected'" />
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants.scss' as *;

.statement-banner {
  background-color: $AwakningColorBlack;
  padding: 30px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: $AwakningColorWhite;
  font-family: $AwakningFontArapey;

  &__title {
    font-family: $AwakningFontArapey;
    font-style: italic;
  }

  &__text {
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
