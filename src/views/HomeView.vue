<script setup lang="ts">
import Hero from '@/components/Hero.vue'
import StatementBanner from '@/components/StatementBanner.vue'
import CollectionListing from '@/components/CollectionListing.vue'
import ProductListing from '@/components/ProductListing.vue'
import NewsletterSignup from '@/components/NewsletterSignup.vue'
import QuoteBanner from '@/components/QuoteBanner.vue'
import { storeToRefs } from 'pinia'
import { useMissionStatementBannerContentStore } from '@/stores/missionStatementBannerContent'
import { useFounderQuoteBannerContentStore } from '@/stores/founderQuoteBannerContent'
import { useByGenderCollectionListingContentStore } from '@/stores/byGenderCollectionListingContent'
import { usePromotionsProductListingContentStore } from '@/stores/promotionsProductListingContent'

// Get the stores instances
const missionStatementBannerContentStore = useMissionStatementBannerContentStore()
const byGenderCollectionListingContentStore = useByGenderCollectionListingContentStore()
const promotionsProductListingContentStore = usePromotionsProductListingContentStore()
const founderQuoteBannerContentStore = useFounderQuoteBannerContentStore()

// Get the store's states and computeds
const {
  content: missionStatementBannerContent,
  contentFetchState: missionStatementBannerContentFetchState,
} = storeToRefs(missionStatementBannerContentStore)
const {
  content: byGenderCollectionListingContent,
  contentFetchState: byGenderCollectionListingContentFetchState,
} = storeToRefs(byGenderCollectionListingContentStore)
const {
  content: promotionsProductListingContent,
  contentFetchState: promotionsProductListingContentFetchState,
} = storeToRefs(promotionsProductListingContentStore)
const {
  content: founderQuoteBannerContent,
  contentFetchState: founderQuoteBannerContentFetchState,
} = storeToRefs(founderQuoteBannerContentStore)
</script>

<template>
  <div class="home-view-container">
    <h1 class="sr-only">Homepage - Awakning Buddhist Jewelry</h1>
    <Hero />
    <StatementBanner
      :content="missionStatementBannerContent"
      :content-fetch-state="missionStatementBannerContentFetchState"
    />
    <CollectionListing
      :content="byGenderCollectionListingContent"
      :content-fetch-state="byGenderCollectionListingContentFetchState"
    />
    <ProductListing
      :content="promotionsProductListingContent"
      :content-fetch-state="promotionsProductListingContentFetchState"
    />
    <NewsletterSignup />
    <QuoteBanner
      :content="founderQuoteBannerContent"
      :content-fetch-state="founderQuoteBannerContentFetchState"
    />
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants' as *;

.home-view-container {
  @media screen and (min-width: $breakpointDesktop) {
    position: relative;
    margin-top: -129px;
    width: 100%;
  }
}
</style>
