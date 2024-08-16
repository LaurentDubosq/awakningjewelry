<script setup lang="ts">
import {
  getProductListingPromotionsData,
  getCollectionListingGenderData,
  getCommentBarMissionData,
} from "@/composables/fetch";
import type {
  ProductListingData,
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
const commentBarMissionData: Ref<CommentBarData | undefined> = ref(undefined);

onMounted(async () => {
  commentBarMissionData.value = await getCommentBarMissionData();
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
const productListingPromotionsData: Ref<ProductListingData | undefined> =
  ref(undefined);

onMounted(async () => {
  productListingPromotionsData.value = await getProductListingPromotionsData();
});
// end ProductListing
</script>

<template>
  <Hero />
  <CommentBar :data="commentBarMissionData" />
  <CollectionListing :data="collectionListingGenderData" />
  <ProductListing :data="productListingPromotionsData" />
</template>
