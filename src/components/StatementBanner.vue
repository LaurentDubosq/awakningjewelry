<script setup lang="ts">
import type { StatementBannerContent } from '@/types/features'
import type { FetchState } from '@/types/fetch'
import LoadingComponent from './LoadingComponent.vue'
import ErrorComponent from './ErrorComponent.vue'
import { computed } from 'vue'

/* As the component can be used multiple times in the application, its parent has the responsibility to fetch the data */
const { content, contentFetchState } = defineProps<{
  content?: StatementBannerContent
  contentFetchState?: FetchState
}>()

const title = computed(() => content?.title)
const statement = computed(() => content?.statement)
const image = computed(() => content?.image)
</script>

<template>
  <section class="statement-banner">
    <template v-if="contentFetchState === 'fulfilled'">
      <h2 class="statement-banner__title" data-testid="statement-banner__title">
        {{ title }}
      </h2>
      <p class="statement-banner__statement" data-testid="statement-banner__statement">
        {{ statement }}
      </p>
      <img
        class="statement-banner__image"
        :src="image?.url"
        :alt="image?.alt"
        loading="lazy"
        data-testid="statement-banner__image"
      />
    </template>
    <LoadingComponent v-else-if="contentFetchState === 'pending'" />
    <ErrorComponent v-else-if="contentFetchState === 'rejected'" />
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants.scss' as *;

.statement-banner {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: $AwakningColorPrimary;
  padding: 30px 15px;
  color: $AwakningColorSecondary;
  font-family: $AwakningFontArapey;
  min-height: 123px;

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
    aspect-ratio: 1/1;
  }
}
</style>
