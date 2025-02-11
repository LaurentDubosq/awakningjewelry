import { ref, type Ref, type ComputedRef, computed, unref } from 'vue'
import type { StatementBanner } from '@/types/components'
import type { UseFetchWithStateReturn, FetchStatus } from '@/types/fetch'
import { defineStore } from 'pinia'

export const useStatementMissionResultStore = defineStore('StatementMissionResult', () => {
  // States
  const statementMissionResult: Ref<undefined | UseFetchWithStateReturn<StatementBanner>> = ref()

  // Computeds
  const statementMissionData: ComputedRef<StatementBanner | undefined> = computed(() =>
    unref(statementMissionResult.value?.data),
  )

  const statementMissionFetchStatus: ComputedRef<FetchStatus | undefined> = computed(() =>
    unref(statementMissionResult.value?.status),
  )

  // Methods
  const updateStatementMissionResult = (
    newStatementMissionResult: UseFetchWithStateReturn<StatementBanner>,
  ) => {
    statementMissionResult.value = newStatementMissionResult
  }

  return {
    statementMissionResult,
    statementMissionData,
    statementMissionFetchStatus,
    updateStatementMissionResult,
  }
})
