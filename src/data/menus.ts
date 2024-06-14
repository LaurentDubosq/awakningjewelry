export interface SiteMenuItem {
  id: number;
  title: string;
  url: string;
  type: string;
  subMenuItems: Array<SiteSubMenuItem>;
}

export interface SiteSubMenuItem {
  id: number;
  title: string;
  url: string;
  type: string;
}

export const siteMenuItemsUrl: string = "http://localhost:3001/siteMenuItems";
