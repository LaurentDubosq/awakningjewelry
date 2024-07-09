import { mount } from "@vue/test-utils";
import { siteMenuItemsKey } from "@/utils/injectionkeys";
import SiteNav from "@/components/SiteNav.vue";
import SiteNavItem from "@/components/SiteNavItem.vue";
import SiteNavDropdown from "@/components/SiteNavDropdown.vue";
import SiteHeaderIcon from "@/components/SiteHeaderIcon.vue";
import PersonIcon from "@/components/icons/IconPerson.vue";
import frontDataBase from "../../../db.json";

const siteMenuItems = frontDataBase["siteMenuItems"];

describe("SiteNav component:", () => {
  test("renders its entire list", () => {
    const wrapper = mount(SiteNav, {
      global: {
        provide: {
          [siteMenuItemsKey]: siteMenuItems,
        },
      },
    });
    const listItemElements = wrapper.findAll(
      "[data-testid='site-nav__list-item']"
    );
    expect(listItemElements).toHaveLength(siteMenuItems.length);
  });

  describe("SiteNavItem component:", () => {
    test("is rendered with its title and link", () => {
      const wrapper = mount(SiteNav, {
        global: {
          provide: {
            [siteMenuItemsKey]: [siteMenuItems[0]], // Select the first siteNavItem data of type text of the db
          },
        },
      });
      const SiteNavItemComponent = wrapper.findComponent(SiteNavItem);

      // Assert the component is rendered
      expect(SiteNavItemComponent.exists()).toBe(true);

      // Assert its title is rendered
      expect(SiteNavItemComponent.text()).toContain(siteMenuItems[0].title);

      // Assert its link is rendered with its expected URL link value
      const linkElement = wrapper.find(
        "[data-testid='site-nav__list-item-link']"
      );
      expect(linkElement.exists()).toBe(true);
      expect(linkElement.attributes("to")).toBe(siteMenuItems[0].url);
    });
  });

  describe("SiteNavDropdown component:", () => {
    test("is rendered and receives the expected 'dropdown' prop value", () => {
      const wrapper = mount(SiteNav, {
        global: {
          provide: {
            [siteMenuItemsKey]: [siteMenuItems[1]], // Select the first SiteNavDropdown data of the db
          },
        },
      });
      const SiteNavDropdownComponent = wrapper.findComponent(SiteNavDropdown);

      // Assert the component is rendered
      expect(SiteNavDropdownComponent.exists()).toBe(true);

      // Assert the expected prop value is well setted
      expect(SiteNavDropdownComponent.props("dropdown")).toMatchObject(
        siteMenuItems[1]
      );
    });
  });

  describe("SiteHeaderIcon component:", () => {
    test("is rendered with its link", () => {
      const wrapper = mount(SiteNav, {
        global: {
          provide: {
            [siteMenuItemsKey]: [siteMenuItems[4]], // Select the first siteNavItem data of type icon of the db
          },
        },
      });

      // Assert the component is rendered
      const SiteHeaderIconComponent = wrapper.findComponent(SiteHeaderIcon);
      expect(SiteHeaderIconComponent.exists()).toBe(true);

      // Assert its link is rendered with its expected URL link value
      const linkElement = wrapper.find(
        "[data-testid='site-nav__list-item-link']"
      );
      expect(linkElement.exists()).toBe(true);
      expect(linkElement.attributes("to")).toBe(siteMenuItems[4].url);
    });

    describe("Icons:", () => {
      test("PersonIcon component is rendered", () => {
        const wrapper = mount(SiteNav, {
          global: {
            provide: {
              [siteMenuItemsKey]: [siteMenuItems[4]], // Select the PersonIcon data of the db
            },
          },
        });

        // Assert the PersonIcon component is rendered
        const PersonIconComponent = wrapper.findComponent(PersonIcon);
        expect(PersonIconComponent.exists()).toBe(true);
      });
    });
  });
});
