<script setup lang="ts">
import { type PropType } from "vue";
import { type ProductListingData } from "@/data/components";
import ProductListingItem from "./ProductListingItem.vue";

const { data } = defineProps({
  data: {
    type: Object as PropType<ProductListingData | undefined>,
  },
});
</script>

<template>
  <section class="productListing">
    <div class="wrapper">
      <h2 class="productListing__title" data-testid="productListing__title">
        {{ data?.title }}
      </h2>
      <hr class="productListing__separator" />
      <ul class="productListing__list">
        <ProductListingItem v-for="product in data?.products" :product />
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@/assets/styles/_constants.scss" as *;

.productListing {
  margin: 45px 0;
  @media screen and (min-width: $AwakningBreakpointDesktop) {
    margin: 90px 0;
  }

  &__title {
    font-size: 1.875rem;
    line-height: 1.4;
    text-align: center;
  }

  &__separator {
    margin-bottom: 30px;
    @media screen and (min-width: $AwakningBreakpointDesktop) {
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
