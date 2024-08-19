<script setup lang="ts">
import { type PropType } from "vue";
import { type CollectionListingData } from "@/data/components";
import CollectionListingItem from "./CollectionListingItem.vue";

const { data } = defineProps({
  data: {
    type: Object as PropType<CollectionListingData | undefined>,
  },
});
</script>

<template>
  <section class="collectionListing">
    <div class="wrapper">
      <h2
        class="collectionListing__title"
        data-testid="collectionListing__title"
      >
        {{ data?.title }}
      </h2>
      <hr class="collectionListing__separator" />
      <ul class="collectionListing__list">
        <CollectionListingItem
          v-for="collection in data?.collections"
          :collection
        />
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@/assets/styles/_constants.scss" as *;

.collectionListing {
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
