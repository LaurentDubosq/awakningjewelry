<script setup lang="ts">
import Hero from '@/components/Hero.vue'
import StatementBanner from '@/components/StatementBanner.vue'
import CollectionListing from '@/components/CollectionListing.vue'
import ProductListing from '@/components/ProductListing.vue'
import NewsletterSignup from '@/components/NewsletterSignup.vue'
import { storeToRefs } from 'pinia'
import { useStatementMissionResultStore } from '@/stores/statementMission'
import { useCollectionsByGenderResultStore } from '@/stores/collectionsByGender'
import { usePromotionsResultStore } from '@/stores/promotions'

// Get the stores instances
const statementMissionStore = useStatementMissionResultStore()
const collectionsByGenderStore = useCollectionsByGenderResultStore()
const promotionsStore = usePromotionsResultStore()

// Get the store's states and computeds
const { statementMissionData, statementMissionFetchStatus } = storeToRefs(statementMissionStore)
const { collectionsByGenderData, collectionsByGenderFetchStatus } =
  storeToRefs(collectionsByGenderStore)
const { promotionsResultData, promotionsResultFetchStatus } = storeToRefs(promotionsStore)
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
