import { ref, type Ref, type ComputedRef, computed, unref } from "vue";
import type { ProductSummary } from "@/types/global.d.ts";
import type { UseFetchWithStateReturn, FetchStatus } from "@/types/fetch";
import { defineStore } from "pinia";

export const usePromotionsResultStore = defineStore("PromotionsResult", () => {
  // States
  const promotionsResult: Ref<
    undefined | UseFetchWithStateReturn<ProductSummary[]>
  > = ref();

  // Computeds
  const promotionsResultData: ComputedRef<ProductSummary[] | undefined> =
    computed(() => unref(promotionsResult.value?.data));

  const promotionsResultFetchStatus: ComputedRef<FetchStatus | undefined> =
    computed(() => unref(promotionsResult.value?.status));

  // Methods
  const updatePromotionsResult = (
    newPromotionsResult: UseFetchWithStateReturn<ProductSummary[]>
  ) => {
    promotionsResult.value = newPromotionsResult;
  };

  return {
    promotionsResult,
    promotionsResultData,
    promotionsResultFetchStatus,
    updatePromotionsResult,
  };
});
