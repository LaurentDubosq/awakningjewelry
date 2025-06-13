<script setup lang="ts">
import type { ProductSummary } from '@/types/global'

const { product } = defineProps<{
  product: ProductSummary
}>()
</script>

<template>
  <li class="product-listing__item" data-testid="product-listing__item">
    <RouterLink
      :to="product.url"
      class="product-listing__item-link"
      :aria-label="`Access the ${product.title} product page`"
      :title="`Access the ${product.title} product page`"
      data-testid="product-listing__item-link"
    >
      <div class="product-listing__item-image-wrapper">
        <img
          :src="product.image.url"
          :alt="product.image.alt"
          class="product-listing__item-image"
          data-testid="product-listing__item-image"
        />
      </div>
      <div class="product-listing__item-details">
        <h3 class="product-listing__item-title" data-testid="product-listing__item-title">
          {{ product.title }}
        </h3>
        <p class="product-listing__item-price" data-testid="product-listing__item-price">
          <del
            aria-description="Original price"
            data-testid="product-listing__item-original-price"
            >{{ product.price }}</del
          >
          <span
            class="product-listing__item-price-discounted"
            aria-description="Discounted price"
            data-testid="product-listing__item-discounted-price"
            >{{ product.promotionalPrice }}</span
          >
        </p>
      </div>
    </RouterLink>
  </li>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants' as *;

.product-listing__item {
  display: flex;
  flex-direction: column;
  align-items: stretch;

  &-image-wrapper {
    width: 100%;
    background-color: $AwakningColorBackgroundMuted;
    padding: 20px 0;
    @media screen and (min-width: 600px) {
      width: auto;
      padding: 0;
    }
  }

  &-image {
    display: block;
    margin: 0 auto;
    max-width: 300px;
    width: 100%;
    @media screen and (min-width: 600px) {
      max-width: 350px;
    }
  }

  &-details {
    margin: 13px 0;
  }

  &-title {
    color: $AwakningColorPrimary;
    font-family: $AwakningFontArapey;
    font-size: 1.25rem;
    font-style: italic;
    font-weight: 500;
    line-height: 1.4;
    text-align: center;
  }

  &-price {
    font-family: $AwakningFontMontserrat;
    font-weight: 400;
    letter-spacing: 0.1rem;
    text-align: center;
  }

  &-price-discounted {
    color: $AwakningColorPromotions;
    margin-left: 0.3125rem;
  }
}
</style>
