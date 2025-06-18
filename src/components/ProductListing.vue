<script setup lang="ts">
import type { FetchState } from '@/types/fetch'
import type { ProductSummary } from '@/types/global.d.ts'
import ProductListingItem from './ProductListingItem.vue'
import LoadingComponent from './LoadingComponent.vue'
import ErrorComponent from './ErrorComponent.vue'

const { title, products, fetchState } = defineProps<{
  title: string
  products?: ProductSummary[]
  fetchState?: FetchState
}>()
</script>

<template>
  <section class="product-listing" aria-labelledby="product-listing-title">
    <div class="wrapper">
      <h2
        class="product-listing__title"
        id="product-listing__title"
        data-testid="product-listing__title"
      >
        {{ title }}
      </h2>
      <hr class="product-listing__separator" />
      <template v-if="fetchState === 'fulfilled'">
        <ul class="product-listing__list" aria-label="Products">
          <ProductListingItem v-for="product in products" :product />
        </ul>
      </template>
      <LoadingComponent v-if="fetchState === 'pending'" />
      <ErrorComponent v-if="fetchState === 'rejected'" />
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants.scss' as *;

.product-listing {
  margin: 45px 0;
  @media screen and (min-width: $BreakpointDesktop) {
    margin: 90px 0;
  }

  &__title {
    color: $AwakningColorPrimary;
    font-size: 1.875rem;
    line-height: 1.4;
    text-align: center;
  }

  &__separator {
    margin-bottom: 30px;
    @media screen and (min-width: $BreakpointDesktop) {
      margin-bottom: 50px;
    }
  }

  &__list {
    display: grid;

    @media screen and (min-width: 600px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 30px;
    }

    @media screen and (min-width: 750px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}
</style>
