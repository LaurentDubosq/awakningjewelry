<script setup lang="ts">
import type { SiteMenuItem } from "@/types/components";
import { computed, inject, type ComputedRef } from "vue";
import { siteMenuKey } from "@/utils/injectionkeys";
import IconPerson from "./icons/IconPerson.vue";
import SiteNavLink from "./SiteNavLink.vue";
import SiteNavDropdown from "./SiteNavDropdown.vue";
import type { UseFetchWithStateReturn } from "@/types/fetch";
import type { FetchStatus } from "@/types/fetch";
import LoadingComponent from "./LoadingComponent.vue";
import ErrorComponent from "./ErrorComponent.vue";

const siteMenuResult: UseFetchWithStateReturn<SiteMenuItem[]> | undefined =
  inject(siteMenuKey);

const siteMenuData: ComputedRef<SiteMenuItem[] | undefined> = computed(
  () => siteMenuResult?.data?.value
);

const siteMenuFetchStatus: ComputedRef<FetchStatus | undefined> = computed(
  () => siteMenuResult?.status?.value
);

// Utilities
function isLink(item: SiteMenuItem): Boolean {
  return item.type === "icon" || item.type === "text";
}
function isDropdown(item: SiteMenuItem): Boolean {
  return item.type === "dropdown";
}
function isAccountLink(item: SiteMenuItem): Boolean {
  return item.name === "account";
}
</script>

<template>
  <nav
    class="site-nav"
    aria-label="Website's desktop navigation bar"
    data-testid="site-nav"
  >
    <ul class="site-nav__list" aria-label="Website's desktop navigation bar">
      <template v-if="siteMenuFetchStatus === 'resolved'">
        <li
          class="site-nav__item"
          data-testid="site-nav__item"
          v-for="menuItem in siteMenuData"
        >
          <SiteNavLink :link="menuItem" v-if="isLink(menuItem)">
            <IconPerson
              v-if="isAccountLink(menuItem)"
              width="27"
              aria-hidden="true"
            />
          </SiteNavLink>
          <SiteNavDropdown
            :dropdown="menuItem"
            v-else-if="isDropdown(menuItem)"
          />
        </li>
      </template>
      <LoadingComponent v-if="siteMenuFetchStatus === 'pending'" />
      <ErrorComponent v-if="siteMenuFetchStatus === 'rejected'" />
    </ul>
  </nav>
</template>

<style scoped lang="scss">
.site-nav__list {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.site-nav__item {
  position: relative;
}
</style>
