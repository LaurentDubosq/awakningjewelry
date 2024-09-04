import { mount } from "@vue/test-utils";
import { toggleBurgerMenuKey } from "@/utils/injectionkeys";
import BurgerMenuDropdownList from "@/components/BurgerMenuDropdownList.vue";
import BurgerMenuDropdownItem from "@/components/BurgerMenuDropdownItem.vue";
import frontDataBase from "../../../db.json";

const siteMenuItems = frontDataBase["siteMenuItems"];
const dropdownList = siteMenuItems[1].subMenuItems;

describe("BurgerMenuDropdownList component:", () => {
  let toggleBurgerMenu;
  let wrapper;
  let listItemElements;
  let BurgerMenuDropdownItemComponents;

  beforeEach(() => {
    toggleBurgerMenu = vi.fn();

    wrapper = mount(BurgerMenuDropdownList, {
      global: {
        provide: {
          [toggleBurgerMenuKey]: toggleBurgerMenu,
        },
      },
      props: { items: dropdownList },
    });

    listItemElements = wrapper.findAll(
      "[data-testid='burger-menu__dropdown-list-item']"
    );
    BurgerMenuDropdownItemComponents = wrapper.findAllComponents(
      BurgerMenuDropdownItem
    );
  });

  test("renders its list entirely", () => {
    expect(listItemElements).toHaveLength(dropdownList.length);
  });

  describe("Each Item:", () => {
    dropdownList.forEach((item, index) => {
      describe(`Item at index ${index}:`, () => {
        test("renders its BurgerMenuDropdownItem component:", () => {
          expect(BurgerMenuDropdownItemComponents[index].exists()).toBe(true);
        });

        test("renders its title", () => {
          expect(BurgerMenuDropdownItemComponents[index].text()).toContain(
            dropdownList[index].title
          );
        });

        it("has a link with its url value well setted", () => {
          const linkElement = listItemElements[index].find(
            "[data-testid='burger-menu__dropdown-list-item-link']"
          );

          // Assert the item has a link tag
          expect(linkElement.exists()).toBe(true);

          // Assert the item has its link value well setted
          expect(linkElement.attributes("to")).toBe(dropdownList[index].url);
        });
      });
    });

    test("triggers the 'toggleBurgerMenu' function when the link is clicked", async () => {
      const firstItemLinkElement = wrapper.find(
        "[data-testid='burger-menu__dropdown-list-item-link']"
      );
      await firstItemLinkElement.trigger("click");
      expect(toggleBurgerMenu).toHaveBeenCalledTimes(1);
    });
  });
});
