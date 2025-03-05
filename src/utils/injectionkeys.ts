import { type InjectionKey } from 'vue'
import type { SiteMenuItem } from '@/types/components'
import type { UseFetchWithStateReturn } from '@/types/fetch'

export const siteMenuKey = Symbol() as InjectionKey<UseFetchWithStateReturn<SiteMenuItem[]>>
export const closeSiteNavDropdownKey = Symbol() as InjectionKey<() => void>
