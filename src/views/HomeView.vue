<script setup lang="ts">
import Hero from '@/components/Hero.vue'
import StatementBanner from '@/components/StatementBanner.vue'
import CollectionListing from '@/components/CollectionListing.vue'
import ProductListing from '@/components/ProductListing.vue'
import { getPromotions, getCollectionsByGender, getStatementMission } from '@/data/dataFetchers'
import type { StatementBanner as StatementBannerInterface } from '@/types/components'
import type { Collection, ProductSummary } from '@/types/global.d.ts'
import type { UseFetchWithStateReturn } from '@/types/fetch'
import { storeToRefs } from 'pinia'

/************************/
/* StatementBanner data */
/************************/
import { useStatementMissionResultStore } from '@/stores/statementMission'

// Get the store instance
const statementMissionStore = useStatementMissionResultStore()

// Get the store's states, computeds and methods
const { statementMissionResult, statementMissionData, statementMissionFetchStatus } =
  storeToRefs(statementMissionStore)
const { updateStatementMissionResult } = statementMissionStore

// Don't fetch the data if the data already exists in the store (for performance reason)
if (!statementMissionResult.value) {
  // Get the data fetch result
  const result: UseFetchWithStateReturn<StatementBannerInterface> = getStatementMission()

  // Update the store with the result
  updateStatementMissionResult(result)
}
/**************************/
/* CollectionListing data */
/**************************/
import { useCollectionsByGenderResultStore } from '@/stores/collectionsByGender'

// Get the store instance
const collectionsByGenderStore = useCollectionsByGenderResultStore()

// Get the store's states, computeds and methods
const { collectionsByGenderResult, collectionsByGenderData, collectionsByGenderFetchStatus } =
  storeToRefs(collectionsByGenderStore)
const { updateCollectionsByGenderResult } = collectionsByGenderStore

// Don't fetch the data if the data already exists in the store (for performance reason)
if (!collectionsByGenderResult.value) {
  // Get the data fetch result
  const result: UseFetchWithStateReturn<Collection[]> = getCollectionsByGender()

  // Update the store with the result
  updateCollectionsByGenderResult(result)
}

/***********************/
/* ProductListing data */
/***********************/
import { usePromotionsResultStore } from '@/stores/promotions'

// Get the store instance
const promotionsStore = usePromotionsResultStore()

// Get the store's states, computeds and methods
const { promotionsResult, promotionsResultData, promotionsResultFetchStatus } =
  storeToRefs(promotionsStore)
const { updatePromotionsResult } = promotionsStore

// Don't fetch the data if the data already exists in the store (for performance reason)
if (!promotionsResult.value) {
  // Get the data fetch result
  const result: UseFetchWithStateReturn<ProductSummary[]> = getPromotions()

  // Update the store with the result
  updatePromotionsResult(result)
}
</script>

<template>
  <div class="home-view-container">
    <Hero />
    <StatementBanner :statement="statementMissionData" :fetchStatus="statementMissionFetchStatus" />
    <CollectionListing
      title="By Gender"
      :collections="collectionsByGenderData"
      :fetchStatus="collectionsByGenderFetchStatus"
    />
    <ProductListing
      title="Promotions"
      :products="promotionsResultData"
      :fetchStatus="promotionsResultFetchStatus"
    />
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants' as *;

.home-view-container {
  @media screen and (min-width: $AwakningBreakpointDesktop) {
    position: absolute;
    top: 0;
    width: 100%;
    z-index: -1;
  }
}
</style>
