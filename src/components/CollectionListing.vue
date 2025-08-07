<script setup lang="ts">
import CollectionListingItem from './CollectionListingItem.vue'
import type { FetchState } from '@/types/fetch'
import LoadingComponent from './LoadingComponent.vue'
import ErrorComponent from './ErrorComponent.vue'
import type { CollectionListingContent } from '@/types/features'
import { computed } from 'vue'

const props = defineProps<{
  content?: CollectionListingContent
  contentFetchState?: FetchState
}>()

const title = computed(() => props.content?.title)
const collections = computed(() => props.content?.collections)
</script>

<template>
  <section
    class="collection-listing"
    :aria-label="`Collections ${title}`"
    data-testid="collection-listing"
  >
    <template v-if="contentFetchState === 'fulfilled'">
      <div class="wrapper">
        <h2
          class="collection-listing__title"
          aria-hidden="true"
          data-testid="collection-listing__title"
        >
          {{ title }}
        </h2>
        <hr class="collection-listing__separator" />
        <ul class="collection-listing__list">
          <CollectionListingItem
            v-for="collection in collections"
            :collection
            :key="collection.id"
          />
        </ul>
      </div>
    </template>
    <LoadingComponent v-else-if="contentFetchState === 'pending'" />
    <ErrorComponent v-else-if="contentFetchState === 'rejected'" />
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants.scss' as *;

.collection-listing {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 45px 0;
  min-height: 227px;
  @media screen and (min-width: $breakpointDesktop) {
    margin: 90px 0;
    min-height: 482px;
  }

  &__title {
    color: $AwakningColorPrimary;
    font-size: 1.875rem;
    line-height: 1.4;
    text-align: center;
  }

  &__separator {
    margin-bottom: 30px;
    @media screen and (min-width: $breakpointDesktop) {
      margin-bottom: 50px;
    }
  }

  &__list {
    display: flex;
    gap: 15px;
  }
}
</style>
