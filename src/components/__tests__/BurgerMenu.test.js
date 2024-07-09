import { mount } from "@vue/test-utils";
import BurgerMenu from "@/components/BurgerMenu.vue";
import BurgerMenuDropdown from "@/components/BurgerMenuDropdown.vue";
import BurgerMenuItem from "@/components/BurgerMenuItem.vue";
import frontDataBase from "../../../db.json";

const siteMenuItems = frontDataBase["siteMenuItems"];
const firstDropdown = siteMenuItems[1];
const firstItem = siteMenuItems[0];

describe("BurgerMenu component:", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(BurgerMenu, {
      props: { siteMenuItems },
    });
  });

  test("renders its entire list", () => {
    const burgerMenuListItemElements = wrapper.findAll(
      "[data-testid='burger-menu__list-item']"
    );
    expect(burgerMenuListItemElements).toHaveLength(siteMenuItems.length);
  });

  describe("BurgerMenuDropdown component:", () => {
    test("is rendered with its 'item' prop", () => {
      const firstBurgerMenuDropdownComponent =
        wrapper.findComponent(BurgerMenuDropdown);

      // Assert the dropdown is rendered
      expect(firstBurgerMenuDropdownComponent.exists()).toBe(true);

      // Assert the 'item' prop value is well setted
      expect(firstBurgerMenuDropdownComponent.props("item")).toMatchObject(
        firstDropdown
      );
    });
  });

  describe("BurgerMenuItem component:", () => {
    test("is rendered with its title and link's URL", () => {
      const firstBurgerMenuItemComponent =
        wrapper.findComponent(BurgerMenuItem);

      // Assert the component is rendered
      expect(firstBurgerMenuItemComponent.exists()).toBe(true);

      // Assert its title is rendered
      expect(firstBurgerMenuItemComponent.text()).toContain(firstItem.title);

      // Assert its link is rendered and well setted
      const firstBurgerMenuItemLinkElement = wrapper.find(
        "[data-testid='burger-menu__link']"
      );
      expect(firstBurgerMenuItemLinkElement.exists()).toBe(true);
      expect(firstBurgerMenuItemLinkElement.attributes("to")).toBe(
        firstItem.url
      );
    });

    test("emits its custom event", async () => {
      const firstBurgerMenuItemLinkElement = wrapper.find(
        "[data-testid='burger-menu__link']"
      );
      await firstBurgerMenuItemLinkElement.trigger("click");
      expect(wrapper.emitted()).toHaveProperty("toggle-burger-menu");
    });
  });
});
