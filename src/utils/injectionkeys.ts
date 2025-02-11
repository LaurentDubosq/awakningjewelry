import { type InjectionKey, type Ref } from 'vue'
import type { SiteMenuItem } from '@/types/components'
import type { UseFetchWithStateReturn } from '@/types/fetch'

export const siteMenuKey = Symbol() as InjectionKey<UseFetchWithStateReturn<SiteMenuItem[]>>
export const toggleBurgerMenuKey = Symbol() as InjectionKey<() => void>
export const closeSiteNavDropdownKey = Symbol() as InjectionKey<() => void>
export const isBurgerMenuOpenKey = Symbol() as InjectionKey<Ref<boolean>>
export const useIsOnMobileKey = Symbol() as InjectionKey<Ref<boolean>>
