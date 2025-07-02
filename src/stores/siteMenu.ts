import { getSiteMenu } from '@/data/dataFetchers'
import type { SiteMenu } from '@/types/components'
import type { FetchState } from '@/types/fetch'
import type { UseFetchWithStateReturn } from '@/types/fetch'
import { defineStore } from 'pinia'
import { computed, ref, unref, type Ref, type ComputedRef } from 'vue'

export const useSiteMenuStore = defineStore('SiteMenu', () => {
  // States
  const siteMenuResult: Ref<UseFetchWithStateReturn<SiteMenu> | undefined> = ref()

  // Computeds
  const siteMenu: ComputedRef<SiteMenu | undefined> = computed(() =>
    unref(siteMenuResult.value?.data),
  )

  const siteMenuFetchState: ComputedRef<FetchState | undefined> = computed(() =>
    unref(siteMenuResult.value?.state),
  )

  // API Call - Data fetching with data caching
  if (!siteMenuResult.value) {
    siteMenuResult.value = getSiteMenu()
  }

  return {
    siteMenuResult,
    siteMenu,
    siteMenuFetchState,
  }
})
