<script setup lang="ts">
import type { Collection } from '@/types/global.d.ts'
import CollectionListingItem from './CollectionListingItem.vue'
import type { FetchState } from '@/types/fetch'
import LoadingComponent from './LoadingComponent.vue'
import ErrorComponent from './ErrorComponent.vue'

const { title, collections, fetchState } = defineProps<{
  title: string
  collections?: Collection[]
  fetchState?: FetchState
}>()
</script>

<template>
  <section class="collection-listing" :aria-label="`Explore our collections ${title}`">
    <div class="wrapper">
      <h2 class="collection-listing__title" data-testid="collection-listing__title">
        {{ title }}
      </h2>
      <hr class="collection-listing__separator" />
      <ul class="collection-listing__list" aria-label="Collections">
        <template v-if="fetchState === 'fulfilled'">
          <CollectionListingItem v-for="collection in collections" :collection />
        </template>
        <LoadingComponent v-if="fetchState === 'pending'" />
        <ErrorComponent v-if="fetchState === 'rejected'" />
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants.scss' as *;

.collection-listing {
  margin: 45px 0;
  @media screen and (min-width: $BreakpointDesktop) {
    margin: 90px 0;
  }

  &__title {
    color: $AwakningColorPrimary;
    font-size: 1.875rem;
    line-height: 1.4;
    text-align: center;
  }

  &__separator {
    margin-bottom: 30px;
    @media screen and (min-width: $BreakpointDesktop) {
      margin-bottom: 50px;
    }
  }

  &__list {
    display: flex;
    gap: 15px;
  }
}
</style>
