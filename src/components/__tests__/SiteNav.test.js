import { mount } from "@vue/test-utils";
import { siteMenuItemsKey } from "@/utils/injectionkeys";
import SiteNav from "@/components/SiteNav.vue";
import SiteNavItem from "@/components/SiteNavItem.vue";
import SiteNavDropdown from "@/components/SiteNavDropdown.vue";
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

  describe("Each Item:", () => {
    const wrapper = mount(SiteNav, {
      global: {
        provide: {
          [siteMenuItemsKey]: siteMenuItems,
        },
        stubs: {
          SiteNavItem,
          SiteNavDropdown,
        },
      },
    });
    const listItemElements = wrapper.findAll(
      "[data-testid='site-nav__list-item']"
    );

    siteMenuItems.forEach((item, index) => {
      if (item.type === "text" && !item.subMenuItems) {
        describe(`SiteNav's item at index ${index}:`, () => {
          const SiteNavItemComponent =
            listItemElements[index].findComponent(SiteNavItem);

          test("is rendered", () => {
            expect(SiteNavItemComponent.exists()).toBe(true);
          });

          test("renders its title", () => {
            expect(SiteNavItemComponent.text()).toContain(
              siteMenuItems[index].title
            );
          });

          it("has a link with its url value well setted", () => {
            const linkElement = listItemElements[index].find(
              "[data-testid='site-nav__list-item-link']"
            );

            // Assert the item has a link tag
            expect(linkElement.exists()).toBe(true);

            // Assert the item has its link value well setted
            expect(linkElement.attributes("to")).toBe(siteMenuItems[index].url);
          });
        });
      } else if (item.type === "text" && item.subMenuItems) {
        describe(`SiteNav's dropdown at index ${index}:`, () => {
          const SiteNavDropdownComponent =
            listItemElements[index].findComponent(SiteNavDropdown);

          test("is rendered", () => {
            expect(SiteNavDropdownComponent.exists()).toBe(true);
          });

          test("has its 'dropdown' prop value well setted", () => {
            expect(SiteNavDropdownComponent.props("dropdown")).toMatchObject(
              siteMenuItems[index]
            );
          });
        });
      } else if (item.type === "icon" && item.title === "Account") {
        describe(`Account's icon at index ${index}:`, () => {
          test("is rendered", () => {
            const PersonIconComponent =
              listItemElements[index].findComponent(PersonIcon);
            expect(PersonIconComponent.exists()).toBe(true);
          });

          it("has a link with its url value well setted", () => {
            const linkElement = listItemElements[index].find(
              "[data-testid='site-nav__list-item-link']"
            );

            // Assert the icon has a link tag
            expect(linkElement.exists()).toBe(true);

            // Assert the icon has its link value well setted
            expect(linkElement.attributes("to")).toBe(siteMenuItems[index].url);
          });
        });
      }
    });
  });
});
