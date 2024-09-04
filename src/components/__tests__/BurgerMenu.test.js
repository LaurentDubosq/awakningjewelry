import { mount } from "@vue/test-utils";
import BurgerMenu from "@/components/BurgerMenu.vue";
import BurgerMenuDropdown from "@/components/BurgerMenuDropdown.vue";
import BurgerMenuItem from "@/components/BurgerMenuItem.vue";
import frontDataBase from "../../../db.json";

const siteMenuItems = frontDataBase["siteMenuItems"];

describe("BurgerMenu component:", () => {
  test("renders its list entirely", () => {
    const wrapper = mount(BurgerMenu, {
      props: { siteMenuItems },
    });
    const listItemElements = wrapper.findAll(
      "[data-testid='burger-menu__list-item']"
    );
    expect(listItemElements).toHaveLength(siteMenuItems.length);
  });

  describe("Each Item:", () => {
    const wrapper = mount(BurgerMenu, {
      props: { siteMenuItems },
    });
    const listItemElements = wrapper.findAll(
      "[data-testid='burger-menu__list-item']"
    );

    siteMenuItems.forEach((item, index) => {
      // BurgerMenu Dropdown Tests
      if (item.subMenuItems) {
        describe(`BurgerMenu's dropdown at index ${index}:`, () => {
          const BurgerMenuDropdownComponent =
            listItemElements[index].findComponent(BurgerMenuDropdown);

          test("is rendered", () => {
            expect(BurgerMenuDropdownComponent.exists()).toBe(true);
          });

          test("has its 'dropdown' prop value well setted", () => {
            expect(BurgerMenuDropdownComponent.props("dropdown")).toMatchObject(
              siteMenuItems[index]
            );
          });
        });
      }
      // BurgerMenu Item Tests
      else {
        describe(`BurgerMenu's item at index ${index}:`, () => {
          const BurgerMenuItemComponent =
            listItemElements[index].findComponent(BurgerMenuItem);

          test("is rendered", () => {
            expect(BurgerMenuItemComponent.exists()).toBe(true);
          });

          test("renders its title", () => {
            expect(BurgerMenuItemComponent.text()).toContain(
              siteMenuItems[index].title
            );
          });

          it("has a link with its url value well setted", () => {
            const linkElement = listItemElements[index].find(
              "[data-testid='burger-menu__link']"
            );

            // Assert the item has a link tag
            expect(linkElement.exists()).toBe(true);

            // Assert the item has its link value well setted
            expect(linkElement.attributes("to")).toBe(siteMenuItems[index].url);
          });
        });
      }
    });
  });

  describe("BurgerMenuItem", () => {
    test("emits its 'close-burger-menu' custom event when the BurgerMenuItem link is clicked", async () => {
      const wrapper = mount(BurgerMenu, {
        props: { siteMenuItems },
      });
      const firstBurgerMenuItemLinkElement = wrapper.find(
        "[data-testid='burger-menu__link']"
      );
      await firstBurgerMenuItemLinkElement.trigger("click");
      expect(wrapper.emitted("close-burger-menu")).toHaveLength(1);
    });
  });
});
