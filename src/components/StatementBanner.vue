<script setup lang="ts">
import { type StatementBanner } from "@/types/components";
import type { UseFetchWithStateReturn } from "@/types/fetch";
import type { FetchStatus } from "@/types/fetch";
import LoadingComponent from "./LoadingComponent.vue";
import ErrorComponent from "./ErrorComponent.vue";
import { type PropType, type ComputedRef, computed } from "vue";

/* As the component can be used multiple times in the application, its parent has the responsibility to fetch the data */
const { statementResult } = defineProps({
  statementResult: {
    type: Object as PropType<UseFetchWithStateReturn<StatementBanner>>,
    required: true,
  },
});

const statementData: ComputedRef<StatementBanner | undefined> = computed(
  () => statementResult.data?.value
);

const statementFetchStatus: ComputedRef<FetchStatus | undefined> = computed(
  () => statementResult?.status?.value
);
</script>

<template>
  <section
    class="statement-banner"
    aria-roledescription="statement banner"
    aria-labelledby="statement-banner__title"
  >
    <template v-if="statementFetchStatus === 'resolved'">
      <h2
        class="statement-banner__title"
        id="statement-banner__title"
        aria-describedby="statement-banner__text"
        data-testid="statement-banner__title"
      >
        {{ statementData?.title }}
      </h2>
      <p
        class="statement-banner__text"
        id="statement-banner__text"
        data-testid="statement-banner__text"
      >
        {{ statementData?.text }}
      </p>
      <img
        :src="statementData?.image.url"
        :alt="statementData?.image.alt"
        class="statement-banner__image"
        data-testid="statement-banner__image"
      />
    </template>
    <LoadingComponent v-if="statementFetchStatus === 'pending'" />
    <ErrorComponent v-if="statementFetchStatus === 'rejected'" />
  </section>
</template>

<style scoped lang="scss">
@use "@/assets/styles/_constants.scss" as *;

.statement-banner {
  background-color: $AwakningColorBlack;
  padding: 30px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: $AwakningColorWhite;
  font-family: $AwakningFontArapey;

  &__title {
    font-family: $AwakningFontArapey;
    font-style: italic;
  }

  &__text {
    max-width: 400px;
    text-align: center;
    text-transform: uppercase;
    font-size: 1.125rem;
  }

  &__image {
    margin-top: 10px;
    width: 32px;
  }
}
</style>
