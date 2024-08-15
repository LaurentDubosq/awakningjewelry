<script setup lang="ts">
import { getProductListingPromotions } from "@/composables/fetch";
import type { ProductListing } from "@/data/components";
import { defineAsyncComponent, onMounted, ref, type Ref } from "vue";

const Hero = defineAsyncComponent(() => import("@/components/Hero.vue"));
const CommentBar = defineAsyncComponent(
  () => import("@/components/CommentBar.vue")
);
const CollectionListing = defineAsyncComponent(
  () => import("@/components/CollectionListing.vue")
);
const ProductListing = defineAsyncComponent(
  () => import("@/components/ProductListing.vue")
);

// ProductListing
const productListingPromotions: Ref<ProductListing | undefined> =
  ref(undefined);

onMounted(async () => {
  productListingPromotions.value = await getProductListingPromotions();
});
// end ProductListing
</script>

<template>
  <Hero />
  <CommentBar />
  <CollectionListing />
  <ProductListing :data="productListingPromotions" />
</template>
