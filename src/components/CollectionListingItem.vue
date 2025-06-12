<script setup lang="ts">
import type { Collection } from '@/types/global'

const { collection } = defineProps<{
  collection: Collection
}>()
</script>

<template>
  <li class="collection-listing__item" data-testid="collection-listing__item">
    <RouterLink
      class="collection-listing__item-link"
      :to="collection.url"
      :title="`Explore ${collection.title} collection`"
      data-testid="collection-listing__link"
    >
      <img
        :src="collection.image.url"
        alt=""
        class="collection-listing__item-img"
        aria-hidden="true"
        data-testid="collection-listing__item-img"
      />
      <h3 class="collection-listing__item-title" data-testid="collection-listing__item-title">
        {{ collection.title }}
      </h3>
    </RouterLink>
  </li>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants.scss' as *;

.collection-listing__item {
  flex-basis: 50%;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(0.98);
  }

  &-link {
    position: relative;
    display: inline-block;
  }

  &-img {
    display: block;
    filter: brightness(25%);
  }

  &-title {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: $AwakningPermanentColorWhite;
    font-family: $AwakningFontArapey;
    font-size: 1.625rem;
    font-weight: 400;
    font-style: italic;
    text-shadow: $AwakningPermanentColorWhite 1px 0 10px;
    @media screen and (min-width: 400px) {
      font-size: 2.125rem;
    }
  }
}
</style>
