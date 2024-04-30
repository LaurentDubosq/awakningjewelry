export interface siteMenuItem {
  id: number;
  title: string;
  url: string;
  type: string;
  subSiteMenuItems: Array<subSiteMenuItemsItem>;
}

export interface subSiteMenuItemsItem {
  id: number;
  title: string;
  url: string;
  type: string;
}

export const siteMenuItemsUrl = "http://localhost:3001/site-menu-items";
