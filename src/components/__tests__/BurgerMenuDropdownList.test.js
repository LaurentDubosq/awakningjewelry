import { mount } from "@vue/test-utils";
import { toggleBurgerMenuKey } from "@/utils/injectionkeys";
import BurgerMenuDropdownList from "@/components/BurgerMenuDropdownList.vue";
import frontDataBase from "../../../db.json";

const siteMenuItems = frontDataBase["siteMenuItems"];
const dropdownList = siteMenuItems[1].subMenuItems;

describe("BurgerMenuDropdownList component:", () => {
  let toggleBurgerMenu;
  let wrapper;

  beforeEach(() => {
    toggleBurgerMenu = vi.fn();

    wrapper = mount(BurgerMenuDropdownList, {
      global: {
        provide: {
          [toggleBurgerMenuKey]: toggleBurgerMenu,
        },
      },
      props: { list: dropdownList },
    });
  });

  test("renders its list entirely", () => {
    const listItemElements = wrapper.findAll(
      "[data-testid='burger-menu__dropdown-list-item']"
    );
    expect(listItemElements).toHaveLength(dropdownList.length);
  });

  describe("Item:", () => {
    test("is rendered with its title and link URL", () => {
      // Assert the Item title is rendered
      const firstItemElement = wrapper.find(
        "[data-testid='burger-menu__dropdown-list-item']"
      );
      expect(firstItemElement.text()).toContain(dropdownList[0].title);

      // Assert the Item link value is well setted
      const firstItemLinkElement = wrapper.find(
        "[data-testid='burger-menu__dropdown-list-item-link']"
      );
      expect(firstItemLinkElement.attributes("to")).toBe(dropdownList[0].url);
    });

    test("calls the 'toggleBurgerMenu' function when the link is clicked", async () => {
      const firstItemLinkElement = wrapper.find(
        "[data-testid='burger-menu__dropdown-list-item-link']"
      );
      await firstItemLinkElement.trigger("click");
      expect(toggleBurgerMenu).toHaveBeenCalledTimes(1);
    });
  });
});
