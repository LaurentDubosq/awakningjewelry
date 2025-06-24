import { type InjectionKey } from 'vue'

export const closeDropdownKey = Symbol() as InjectionKey<() => void>
