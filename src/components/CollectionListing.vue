<script setup lang="ts">
import CollectionListingItem from './CollectionListingItem.vue'
import type { FetchState } from '@/types/fetch'
import LoadingComponent from './LoadingComponent.vue'
import ErrorComponent from './ErrorComponent.vue'
import type { CollectionListingContent } from '@/types/components'
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
    <div class="wrapper">
      <h2
        class="collection-listing__title"
        aria-hidden="true"
        data-testid="collection-listing__title"
      >
        {{ title }}
      </h2>
      <hr class="collection-listing__separator" />
      <template v-if="contentFetchState === 'fulfilled'">
        <ul class="collection-listing__list">
          <CollectionListingItem v-for="collection in collections" :collection />
        </ul>
      </template>
      <LoadingComponent v-else-if="contentFetchState === 'pending'" />
      <ErrorComponent v-else-if="contentFetchState === 'rejected'" />
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
