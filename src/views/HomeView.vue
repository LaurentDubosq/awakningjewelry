<script setup lang="ts">
import Hero from '@/components/Hero.vue'
import StatementBanner from '@/components/StatementBanner.vue'
import CollectionListing from '@/components/CollectionListing.vue'
import ProductListing from '@/components/ProductListing.vue'
import NewsletterSignup from '@/components/NewsletterSignup.vue'
import { storeToRefs } from 'pinia'
import { useStatementMissionWordingResultStore } from '@/stores/statementMission'
import { useCollectionsByGenderResultStore } from '@/stores/collectionsByGender'
import { usePromotionsResultStore } from '@/stores/promotions'

// Get the stores instances
const statementMissionWordingResultStore = useStatementMissionWordingResultStore()
const collectionsByGenderStore = useCollectionsByGenderResultStore()
const promotionsStore = usePromotionsResultStore()

// Get the store's states and computeds
const { wording: statementMissionWording, wordingFetchStatus: statementMissionWordingFetchStatus } =
  storeToRefs(statementMissionWordingResultStore)
const { collectionsByGenderData, collectionsByGenderFetchStatus } =
  storeToRefs(collectionsByGenderStore)
const { promotionsResultData, promotionsResultFetchStatus } = storeToRefs(promotionsStore)
</script>

<template>
  <div class="home-view-container">
    <Hero />
    <StatementBanner
      :wording="statementMissionWording"
      :wordingFetchStatus="statementMissionWordingFetchStatus"
    />
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
    <NewsletterSignup />
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
