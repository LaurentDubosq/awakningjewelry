import { type InjectionKey, type Ref } from "vue";
import type { SiteMenuItem } from "@/data/menus";

export const siteMenuItemsKey = Symbol() as InjectionKey<
  Ref<SiteMenuItem[] | undefined>
>;
export const toggleBurgerMenuKey = Symbol() as InjectionKey<Function>;
export const isBurgerMenuOpenKey = Symbol() as InjectionKey<Ref<Boolean>>;
