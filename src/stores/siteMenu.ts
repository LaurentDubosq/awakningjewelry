import { getSiteMenu } from '@/data/dataFetchers'
import type { SiteMenu } from '@/types/components'
import type { FetchState } from '@/types/fetch'
import type { UseFetchWithStateReturn } from '@/types/fetch'
import { defineStore } from 'pinia'
import { computed, ref, unref, type Ref, type ComputedRef } from 'vue'

export const useSiteMenuStore = defineStore('SiteMenu', () => {
  // States
  const siteMenu: Ref<UseFetchWithStateReturn<SiteMenu> | undefined> = ref()

  // Computeds
  const siteMenuData: ComputedRef<SiteMenu | undefined> = computed(() =>
    unref(siteMenu.value?.data),
  )

  const siteMenuResultFetchState: ComputedRef<FetchState | undefined> = computed(() =>
    unref(siteMenu.value?.status),
  )

  // API Call - Data fetching with data caching
  if (!siteMenu.value) {
    siteMenu.value = getSiteMenu()
  }

  return {
    siteMenu,
    siteMenuData,
    siteMenuResultFetchState,
  }
})
