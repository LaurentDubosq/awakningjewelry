import { getSiteMenu } from '@/data/dataFetchers'
import type { SiteMenuItem } from '@/types/components'
import type { FetchStatus } from '@/types/fetch'
import type { UseFetchWithStateReturn } from '@/types/fetch'
import { defineStore } from 'pinia'
import { computed, ref, unref, type Ref, type ComputedRef } from 'vue'

export const useSiteMenuStore = defineStore('SiteMenu', () => {
  // States
  const siteMenu: Ref<UseFetchWithStateReturn<SiteMenuItem[]> | undefined> = ref()

  // Computeds
  const siteMenuData: ComputedRef<SiteMenuItem[] | undefined> = computed(() =>
    unref(siteMenu.value?.data),
  )

  const siteMenuResultFetchStatus: ComputedRef<FetchStatus | undefined> = computed(() =>
    unref(siteMenu.value?.status),
  )

  // API Call - Data fetching with data caching
  if (!siteMenu.value) {
    siteMenu.value = getSiteMenu()
  }

  return {
    siteMenu,
    siteMenuData,
    siteMenuResultFetchStatus,
  }
})
