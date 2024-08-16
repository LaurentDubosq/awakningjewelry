<script setup lang="ts">
import type { Product } from "@/data/global.d.ts";
import type { PropType } from "vue";

const { product } = defineProps({
  product: { type: Object as PropType<Product>, required: true },
});
</script>

<template>
  <li class="productListing__item">
    <RouterLink
      class="productListing__item-link"
      :to="product.url"
      data-testid="productListing__item-link"
    >
      <div class="productListing__item-link-inner">
        <div class="productListing__item-image-wrapper">
          <img
            :src="product.image.url"
            :alt="product.image.alt"
            class="productListing__item-image"
            data-testid="productListing__item-image"
          />
        </div>
        <div class="productListing__item-details">
          <h3
            class="productListing__item-title"
            data-testid="productListing__item-title"
          >
            {{ product.title }}
          </h3>
          <div
            class="productListing__item-price"
            data-testid="productListing__item-price"
          >
            <span class="price--strikethrough">{{ product.price }}</span>
            <span class="price--discounted">{{
              product.promotionalPrice
            }}</span>
          </div>
        </div>
      </div>
    </RouterLink>
  </li>
</template>

<style scoped lang="scss">
@use "@/assets/styles/_constants" as *;

.productListing__item {
  display: flex;
  flex-direction: column;
  align-items: stretch;

  &-image-wrapper {
    width: 100%;
    background-color: $AwakningColorVeryLightGray;
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
}
</style>
