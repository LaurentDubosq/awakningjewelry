<!-- This component has attached documentation. This concerns payment solution logos path. Find it at docs/features/SiteFooter.md -->

<script setup lang="ts">
import { getPaymentSolutions } from '@/data/dataFetchers'
import type { UseFetchWithStateReturn } from '@/types/fetch'
import type { PaymentSolution } from '@/types/global'
import LoadingComponent from './LoadingComponent.vue'
import ErrorComponent from './ErrorComponent.vue'

const { data: solutions, state: solutionsFetchState }: UseFetchWithStateReturn<PaymentSolution[]> =
  getPaymentSolutions()
</script>

<template>
  <div class="payment-solutions">
    <template v-if="solutionsFetchState === 'fulfilled'">
      <ul
        class="payment-solutions-list"
        aria-label="Payment solutions"
        data-testid="payment-solutions"
      >
        <li
          class="payment-solutions-item"
          v-for="paymentSolution in solutions"
          :key="paymentSolution.id"
        >
          <img
            :src="paymentSolution.url"
            width="38"
            height="24"
            :alt="paymentSolution.alt"
            :title="paymentSolution.title"
            loading="lazy"
            data-testid="payment-solution"
          />
        </li>
      </ul>
    </template>
    <LoadingComponent v-else-if="solutionsFetchState === 'pending'" />
    <ErrorComponent v-else-if="solutionsFetchState === 'rejected'" />
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants' as *;
.payment-solutions {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70px;
  margin-top: 15px;

  &-list {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 7.5px;

    @media screen and (min-width: $breakpointDesktop) {
      justify-content: flex-end;
    }
  }
}
</style>
