<script setup lang="ts">
import type { FetchState } from '@/types/fetch'
import type { ProductListingContent } from '@/types/features'
import ProductListingItem from './ProductListingItem.vue'
import LoadingComponent from './LoadingComponent.vue'
import ErrorComponent from './ErrorComponent.vue'
import { computed } from 'vue'

const props = defineProps<{
  content?: ProductListingContent
  contentFetchState?: FetchState
}>()

const title = computed(() => props.content?.title)
const products = computed(() => props.content?.products)
</script>

<template>
  <section class="product-listing">
    <template v-if="contentFetchState === 'fulfilled'">
      <div class="wrapper">
        <h2 class="product-listing__title" data-testid="product-listing__title">
          {{ title }}
        </h2>
        <hr class="product-listing__separator" />
        <ul class="product-listing__list">
          <ProductListingItem v-for="product in products" :product />
        </ul>
      </div>
    </template>
    <LoadingComponent v-else-if="contentFetchState === 'pending'" />
    <ErrorComponent v-else-if="contentFetchState === 'rejected'" />
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants.scss' as *;

.product-listing {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 45px 0;
  min-height: 930px;
  @media screen and (min-width: $breakpointDesktop) {
    margin: 90px 0;
    min-height: 453px;
  }

  &__title {
    color: $AwakningColorPrimary;
    font-size: 1.875rem;
    line-height: 1.4;
    text-align: center;
  }

  &__separator {
    margin-bottom: 30px;
    @media screen and (min-width: $breakpointDesktop) {
      margin-bottom: 50px;
    }
  }

  &__list {
    display: grid;

    @media screen and (min-width: 590px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 30px;
    }

    @media screen and (min-width: $breakpointDesktop) {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}
</style>
