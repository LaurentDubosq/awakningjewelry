<script setup lang="ts">
import {
  getProductListingPromotions,
  getCollectionListingGender,
  getCommentBarData,
} from "@/composables/fetch";
import type {
  ProductListing,
  CollectionListing,
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
const collectionListingGender: Ref<CollectionListing | undefined> =
  ref(undefined);

onMounted(async () => {
  collectionListingGender.value = await getCollectionListingGender();
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
  <CollectionListing :data="collectionListingGender" />
  <ProductListing :data="productListingPromotions" />
</template>
