<script setup lang="ts">
import Hero from '@/components/Hero.vue'
import StatementBanner from '@/components/StatementBanner.vue'
import CollectionListing from '@/components/CollectionListing.vue'
import ProductListing from '@/components/ProductListing.vue'
import NewsletterSignup from '@/components/NewsletterSignup.vue'
import QuoteBanner from '@/components/QuoteBanner.vue'
import { storeToRefs } from 'pinia'
import { useStatementMissionWordingResultStore } from '@/stores/statementMission'
import { useFounderQuoteBannerContentResultStore } from '@/stores/quoteFounder'
import { useCollectionsByGenderResultStore } from '@/stores/collectionsByGender'
import { usePromotionsResultStore } from '@/stores/promotions'

// Get the stores instances
const statementMissionWordingResultStore = useStatementMissionWordingResultStore()
const collectionsByGenderStore = useCollectionsByGenderResultStore()
const promotionsStore = usePromotionsResultStore()
const founderQuoteBannerContentResultStore = useFounderQuoteBannerContentResultStore()

// Get the store's states and computeds
const { wording: statementMissionWording, wordingFetchState: statementMissionWordingFetchState } =
  storeToRefs(statementMissionWordingResultStore)
const { collectionsByGenderData, collectionsByGenderFetchState } =
  storeToRefs(collectionsByGenderStore)
const { promotionsResultData, promotionsResultFetchState } = storeToRefs(promotionsStore)
const {
  content: founderQuoteBannerContent,
  contentFetchState: founderQuoteBannerContentFetchState,
} = storeToRefs(founderQuoteBannerContentResultStore)
</script>

<template>
  <div class="home-view-container">
    <Hero />
    <StatementBanner
      :wording="statementMissionWording"
      :wordingFetchState="statementMissionWordingFetchState"
    />
    <CollectionListing
      title="By Gender"
      :collections="collectionsByGenderData"
      :fetchState="collectionsByGenderFetchState"
    />
    <ProductListing
      title="Promotions"
      :products="promotionsResultData"
      :fetchState="promotionsResultFetchState"
    />
    <NewsletterSignup />
    <QuoteBanner
      :content="founderQuoteBannerContent"
      :contentFetchState="founderQuoteBannerContentFetchState"
    />
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants' as *;

.home-view-container {
  @media screen and (min-width: $BreakpointDesktop) {
    position: absolute;
    top: 0;
    width: 100%;
    z-index: -1;
  }
}
</style>
