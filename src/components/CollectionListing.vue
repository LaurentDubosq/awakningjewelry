<script setup lang="ts">
import { type PropType, computed, type ComputedRef } from "vue";
import type { Collection } from "@/types/global.d.ts";
import CollectionListingItem from "./CollectionListingItem.vue";
import type { UseFetchWithStateReturn } from "@/types/fetch";
import type { FetchStatus } from "@/types/fetch";
import LoadingComponent from "./LoadingComponent.vue";
import ErrorComponent from "./ErrorComponent.vue";

const { title, collectionsResult } = defineProps({
  title: { type: String, required: true },
  collectionsResult: {
    type: Object as PropType<UseFetchWithStateReturn<Collection[]>>,
    required: true,
  },
});

const collectionsData: ComputedRef<Collection[] | undefined> = computed(
  () => collectionsResult.data.value
);

const collectionsFetchStatus: ComputedRef<FetchStatus | undefined> = computed(
  () => collectionsResult?.status?.value
);
</script>

<template>
  <section
    class="collection-listing"
    :aria-label="`Explore our collections ${title}`"
  >
    <div class="wrapper">
      <h2
        class="collection-listing__title"
        data-testid="collection-listing__title"
      >
        {{ title }}
      </h2>
      <hr class="collection-listing__separator" />
      <ul class="collection-listing__list" aria-label="Collections">
        <template v-if="collectionsFetchStatus === 'resolved'">
          <CollectionListingItem
            v-for="collection in collectionsData"
            :collection
          />
        </template>
        <LoadingComponent v-if="collectionsFetchStatus === 'pending'" />
        <ErrorComponent v-if="collectionsFetchStatus === 'rejected'" />
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@/assets/styles/_constants.scss" as *;

.collection-listing {
  margin: 45px 0;
  @media screen and (min-width: $AwakningBreakpointDesktop) {
    margin: 90px 0;
  }

  &__title {
    font-size: 1.875rem;
    line-height: 1.4;
    text-align: center;
  }

  &__separator {
    margin-bottom: 30px;
    @media screen and (min-width: $AwakningBreakpointDesktop) {
      margin-bottom: 50px;
    }
  }

  &__list {
    display: flex;
    gap: 15px;
  }
}
</style>
