<script setup lang="ts">
import type { Collection } from "@/data/components";
import { onMounted, onUnmounted, ref, type PropType, type Ref } from "vue";

const { collection } = defineProps({
  collection: { type: Object as PropType<Collection>, required: true },
});

const itemElement: Ref<HTMLLIElement | null> = ref(null);

const setItemElementHeight = (element: HTMLLIElement) => {
  element.style.height = element.clientWidth + "px";
};

// Set the element height at initial render
onMounted(() => {
  if (itemElement.value) {
    setItemElementHeight(itemElement.value);
  }
});
// end Set the element height at initial render

// Set the element height at resize
onMounted(() => {
  window.addEventListener("resize", () => {
    if (itemElement.value) {
      setItemElementHeight(itemElement.value);
    }
  });
});

onUnmounted(() => {
  window.removeEventListener("resize", () => {
    if (itemElement.value) {
      setItemElementHeight(itemElement.value);
    }
  });
});
// end Set the element height at resize
</script>

<template>
  <li
    class="collectionListing__item"
    :style="{ backgroundImage: `url(${collection.image})` }"
    ref="itemElement"
    data-testid="collectionListing__item"
  >
    <RouterLink
      :to="collection.url"
      class="collectionListing__item-link"
      data-testid="collectionListing__link"
    >
      <h3
        class="collectionListing__item-title"
        data-testid="collectionListing__item-title"
      >
        {{ collection.title }}
      </h3>
    </RouterLink>
  </li>
</template>

<style scoped lang="scss">
@use "@/assets/styles/_constants.scss" as *;

.collectionListing__item {
  flex-basis: 50%;
  background-size: cover;

  &-link {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &-title {
    color: $AwakningColorWhite;
    font-family: $AwakningFontArapey;
    font-size: 1.625rem;
    font-weight: 400;
    font-style: italic;
    text-shadow: black 1px 0 10px;
    @media screen and (min-width: 400px) {
      font-size: 2.125rem;
    }
  }
}
</style>
