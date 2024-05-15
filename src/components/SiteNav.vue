<script setup lang="ts">
import type { SiteMenuItem } from "@/data/menus";
import { inject, type Ref } from "vue";
import { siteMenuItemsKey } from "@/utils/injectionkeys";
import SiteHeaderIcon from "./SiteHeaderIcon.vue";
import PersonIcon from "./icons/IconPerson.vue";
import SiteNavLink from "./SiteNavLink.vue";
import SiteNavDropdown from "./SiteNavDropdown.vue";

const siteMenuItems: Ref<SiteMenuItem[] | undefined> | undefined =
  inject(siteMenuItemsKey);
</script>

<template>
  <nav class="site-nav">
    <menu class="site-nav__list">
      <li class="site-nav__list-item" v-for="menuItem in siteMenuItems">
        <template v-if="menuItem.type === 'text'">
          <SiteNavLink :url="menuItem.url" v-if="!menuItem.subMenuItems">{{
            menuItem.title
          }}</SiteNavLink>
          <SiteNavDropdown
            :menuItem="menuItem"
            v-else-if="menuItem.subMenuItems"
          />
        </template>
        <template v-else-if="menuItem.type === 'icon'">
          <SiteHeaderIcon behavior="link" url="/account">
            <PersonIcon />
          </SiteHeaderIcon>
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
