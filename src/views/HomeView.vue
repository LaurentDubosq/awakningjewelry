<script setup lang="ts">
import useGetAsyncComponent from "@/composables/useGetAsyncComponent";
import {
  getPromotions,
  getCollectionsByGender,
  getStatementMission,
} from "@/data/dataFetchers";
import type { StatementBanner as StatementBannerInterface } from "@/types/components";
import type { Collection, ProductSummary } from "@/types/global.d.ts";
import type { UseFetchWithStateReturn } from "@/types/fetch";
import { defineAsyncComponent } from "vue";

const Hero = defineAsyncComponent(useGetAsyncComponent("Hero"));
const StatementBanner = defineAsyncComponent(
  useGetAsyncComponent("StatementBanner")
);
const CollectionListing = defineAsyncComponent(
  useGetAsyncComponent("CollectionListing")
);
const ProductListing = defineAsyncComponent(
  useGetAsyncComponent("ProductListing")
);

/* StatementBanner data */
const statementMissionResult: UseFetchWithStateReturn<StatementBannerInterface> =
  getStatementMission();

/* CollectionListing data */
const collectionsByGenderResult: UseFetchWithStateReturn<Collection[]> =
  getCollectionsByGender();

/* ProductListing data */
const promotionsResult: UseFetchWithStateReturn<ProductSummary[]> =
  getPromotions();
</script>

<template>
  <div class="home-view-container">
    <Hero />
    <StatementBanner :statementResult="statementMissionResult" />
    <CollectionListing
      title="By Gender"
      :collectionsResult="collectionsByGenderResult"
    />
    <ProductListing title="Promotions" :productsResult="promotionsResult" />
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/_constants" as *;

.home-view-container {
  @media screen and (min-width: $AwakningBreakpointDesktop) {
    position: absolute;
    top: 0;
    width: 100%;
    z-index: -1;
  }
}
</style>
