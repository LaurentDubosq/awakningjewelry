import { mount } from "@vue/test-utils";
import BurgerMenuDropdown from "@/components/BurgerMenuDropdown.vue";
import BurgerMenuDropdownHeader from "@/components/BurgerMenuDropdownHeader.vue";
import BurgerMenuDropdownList from "@/components/BurgerMenuDropdownList.vue";
import frontDataBase from "../../../db.json";

const siteMenuItems = frontDataBase["siteMenuItems"];
const dropdown = siteMenuItems[1];

describe("BurgerMenuDropdown component:", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(BurgerMenuDropdown, {
      props: { item: dropdown },
    });
  });

  describe("BurgerMenuDropdownHeader component:", () => {
    test("renders its title", () => {
      const BurgerMenuDropdownHeaderComponent = wrapper.findComponent(
        BurgerMenuDropdownHeader
      );
      expect(BurgerMenuDropdownHeaderComponent.text()).toContain(
        dropdown.title
      );
    });

    test("has its 'isDropdownOpen' prop value well setted", () => {
      const BurgerMenuDropdownHeaderComponent = wrapper.findComponent(
        BurgerMenuDropdownHeader
      );
      expect(BurgerMenuDropdownHeaderComponent.props("isDropdownOpen")).toBe(
        true
      );
    });

    test("correctly triggers the 'toggle-dropdown' custom event handler", async () => {
      // Click on the dropdown icon
      const headerIconButtonElement = wrapper.find(
        "[data-testid='burger-menu__dropdown-header-button']"
      );
      await headerIconButtonElement.trigger("click");

      // Assert the custom event handler has been fired by checking the value of 'isDropdownOpen' variable used as prop after being toggled
      const BurgerMenuDropdownHeaderComponent = wrapper.findComponent(
        BurgerMenuDropdownHeader
      );
      expect(BurgerMenuDropdownHeaderComponent.props("isDropdownOpen")).toBe(
        false
      );
    });
  });

  describe("BurgerMenuDropdownList component:", () => {
    test("is rendered at initial render", () => {
      const BurgerMenuDropdownListComponent = wrapper.findComponent(
        BurgerMenuDropdownList
      );
      expect(BurgerMenuDropdownListComponent.exists()).toBe(true);
    });

    test("is not rendered when the header icon is clicked", async () => {
      // Close the dropdown
      const headerIconButtonElement = wrapper.find(
        "[data-testid='burger-menu__dropdown-header-button']"
      );
      await headerIconButtonElement.trigger("click");

      // Assert the list is not rendered anymore
      const BurgerMenuDropdownListComponent = wrapper.findComponent(
        BurgerMenuDropdownList
      );
      expect(BurgerMenuDropdownListComponent.exists()).toBe(false);
    });

    test("has its 'list' prop value well setted", () => {
      const BurgerMenuDropdownListComponent = wrapper.findComponent(
        BurgerMenuDropdownList
      );
      expect(BurgerMenuDropdownListComponent.props("list")).toMatchObject(
        dropdown.subMenuItems
      );
    });
  });
});
