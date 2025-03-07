import { type InjectionKey } from 'vue'

export const closeSiteNavDropdownKey = Symbol() as InjectionKey<() => void>
