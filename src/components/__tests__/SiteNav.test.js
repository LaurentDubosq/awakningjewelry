import { mount } from "@vue/test-utils";
import { describe, test, expect, beforeEach } from "vitest";
import SiteNav from "@/components/SiteNav.vue";
import { siteMenuItemsKey } from "@/utils/injectionkeys";
import SiteNavItem from "@/components/SiteNavItem.vue";
import SiteNavDropdown from "@/components/SiteNavDropdown.vue";
import PersonIcon from "@/components/icons/IconPerson.vue";
import frontDataBase from "../../../db.json";

const dummySiteMenuItems = frontDataBase["siteMenuItems"];

describe("SiteNav component:", () => {
  test("renders all the site navigation items", () => {
    const wrapper = mount(SiteNav, {
      global: {
        provide: {
          [siteMenuItemsKey]: dummySiteMenuItems,
        },
      },
    });
    const siteNavListItemElements = wrapper.findAll(".site-nav__list-item");
    expect(siteNavListItemElements).toHaveLength(dummySiteMenuItems.length);
  });

  describe("SiteNavItem component:", () => {
    let wrapper;

    beforeEach(() => {
      wrapper = mount(SiteNav, {
        global: {
          provide: {
            [siteMenuItemsKey]: [dummySiteMenuItems[0]], // Only provides the expected item to be able to check if other unwanted element/component are rendered
          },
        },
      });
    });

    test("renders its slot content", () => {
      const SiteNavItemComponent = wrapper.findComponent(SiteNavItem);
      expect(SiteNavItemComponent.text()).toContain(
        dummySiteMenuItems[0].title
      );
    });

    test("is wrapped by a link with the expected URL", () => {
      const siteNavListItemLinkElement = wrapper.find(
        "[data-testclass='site-nav__list-item-link']"
      );
      const SiteNavItemComponent =
        siteNavListItemLinkElement.findComponent(SiteNavItem);

      // Assert the SiteNavItem component is wrapped by a link - because of critical component
      expect(SiteNavItemComponent.exists()).toBe(true);

      // Assert the SiteNavItem component has the expected URL
      expect(siteNavListItemLinkElement.attributes("to")).toContain(
        dummySiteMenuItems[0].url
      );
    });

    test("don't renders competitor element/component", () => {
      // Additional test - because of complex logic component
      const siteNavListItemElement = wrapper.find(".site-nav__list-item");
      const siteNavListItemChildsLength =
        siteNavListItemElement.element.children.length;
      expect(siteNavListItemChildsLength).not.toBeGreaterThan(1);
    });
  });

  describe("SiteNavDropdown component:", () => {
    let wrapper;

    beforeEach(() => {
      wrapper = mount(SiteNav, {
        global: {
          provide: {
            [siteMenuItemsKey]: [dummySiteMenuItems[1]], // Only provides the expected item to be able to check if other unwanted element/component are rendered
          },
        },
      });
    });

    test("receives the 'dropdown' prop value", () => {
      const SiteNavDropdownComponent = wrapper.findComponent(SiteNavDropdown);
      expect(SiteNavDropdownComponent.props("dropdown")).toEqual(
        dummySiteMenuItems[1]
      );
    });

    test("don't renders competitor element/component", () => {
      // Additional test - because of complex logic component
      const siteNavListItemElement = wrapper.find(".site-nav__list-item");
      const siteNavListItemChildsLength =
        siteNavListItemElement.element.children.length;
      expect(siteNavListItemChildsLength).not.toBeGreaterThan(1);
    });
  });

  describe("PersonIcon component:", () => {
    let wrapper;

    beforeEach(() => {
      wrapper = mount(SiteNav, {
        global: {
          provide: {
            [siteMenuItemsKey]: [dummySiteMenuItems[4]], // Only provides the expected item to be able to check if other unwanted element/component are rendered
          },
        },
      });
    });

    test("is rendered", () => {
      const PersonIconComponent = wrapper.findComponent(PersonIcon);
      expect(PersonIconComponent.exists()).toBe(true);
    });

    test("is wrapped by a link with the expected URL", () => {
      const siteHeaderIconLinkElement = wrapper.find(
        "[data-testclass='site-nav__list-item-link']"
      );
      const PersonIconComponent =
        siteHeaderIconLinkElement.findComponent(PersonIcon);

      // Assert the icon is wrapped by a link - because of critical component
      expect(PersonIconComponent.exists()).toBe(true);

      // Assert the icon has the expected URL
      expect(siteHeaderIconLinkElement.attributes("to")).toContain(
        dummySiteMenuItems[4].url
      );
    });

    test("don't renders competitor element/component", () => {
      // Additional test - because of complex logic component
      const siteNavListItemElement = wrapper.find(".site-nav__list-item");
      const siteNavListItemChildsLength =
        siteNavListItemElement.element.children.length;
      expect(siteNavListItemChildsLength).not.toBeGreaterThan(1);
    });
  });
});
