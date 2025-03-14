import { ref, type Ref, type ComputedRef, computed, unref } from 'vue'
import type { StatementBanner } from '@/types/components'
import type { UseFetchWithStateReturn, FetchStatus } from '@/types/fetch'
import { defineStore } from 'pinia'
import { getStatementMission } from '@/data/dataFetchers'

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

  // API Call - Data fetching with data caching
  if (!statementMissionResult.value) {
    statementMissionResult.value = getStatementMission()
  }

  return {
    statementMissionResult,
    statementMissionData,
    statementMissionFetchStatus,
    updateStatementMissionResult,
  }
})
