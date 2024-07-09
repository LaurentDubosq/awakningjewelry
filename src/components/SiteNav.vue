<script setup lang="ts">
import type { SiteMenuItem } from "@/data/menus";
import { inject, type Ref } from "vue";
import { siteMenuItemsKey } from "@/utils/injectionkeys";
import SiteHeaderIcon from "./SiteHeaderIcon.vue";
import PersonIcon from "./icons/IconPerson.vue";
import SiteNavItem from "./SiteNavItem.vue";
import SiteNavDropdown from "./SiteNavDropdown.vue";

const siteMenuItems: Ref<SiteMenuItem[] | undefined> | undefined =
  inject(siteMenuItemsKey);
</script>

<template>
  <nav class="site-nav">
    <menu class="site-nav__list">
      <li
        class="site-nav__list-item"
        data-testid="site-nav__list-item"
        v-for="menuItem in siteMenuItems"
      >
        <template v-if="menuItem.type === 'text'">
          <RouterLink
            :to="`${menuItem.url}`"
            data-testid="site-nav__list-item-link"
            v-if="!menuItem.subMenuItems"
          >
            <SiteNavItem>
              {{ menuItem.title }}
            </SiteNavItem>
          </RouterLink>
          <SiteNavDropdown :dropdown="menuItem" v-else />
        </template>
        <template v-else-if="menuItem.type === 'icon'">
          <RouterLink :to="menuItem.url" data-testid="site-nav__list-item-link">
            <SiteHeaderIcon>
              <template v-if="menuItem.title === 'Account'">
                <PersonIcon />
              </template>
            </SiteHeaderIcon>
          </RouterLink>
        </template>
      </li>
    </menu>
  </nav>
</template>

<style scoped lang="scss">
.site-nav__list {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.site-nav__list-item {
  position: relative;
}
</style>
