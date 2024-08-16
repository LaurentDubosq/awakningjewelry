<script setup lang="ts">
import {
  getProductListingPromotions,
  getCollectionListingGenderData,
  getCommentBarData,
} from "@/composables/fetch";
import type {
  ProductListing,
  CollectionListingData,
  CommentBarData,
} from "@/data/components";
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

// CommentBar
const commentBarData: Ref<CommentBarData | undefined> = ref(undefined);

onMounted(async () => {
  commentBarData.value = await getCommentBarData();
});
// end CommentBar

// CollectionListing
const collectionListingGenderData: Ref<CollectionListingData | undefined> =
  ref(undefined);

onMounted(async () => {
  collectionListingGenderData.value = await getCollectionListingGenderData();
});
// end CollectionListing

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
  <CommentBar :data="commentBarData" />
  <CollectionListing :data="collectionListingGenderData" />
  <ProductListing :data="productListingPromotions" />
</template>
