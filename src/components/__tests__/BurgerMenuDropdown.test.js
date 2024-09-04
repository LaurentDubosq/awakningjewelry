import { mount } from "@vue/test-utils";
import BurgerMenuDropdown from "@/components/BurgerMenuDropdown.vue";
import BurgerMenuDropdownHeader from "@/components/BurgerMenuDropdownHeader.vue";
import BurgerMenuDropdownList from "@/components/BurgerMenuDropdownList.vue";
import frontDataBase from "../../../db.json";

const dropdown = frontDataBase.siteMenuItems[1];

describe("BurgerMenuDropdown component:", () => {
  let wrapper;
  let BurgerMenuDropdownHeaderComponent;
  let BurgerMenuDropdownListComponent;

  beforeEach(() => {
    wrapper = mount(BurgerMenuDropdown, {
      props: { dropdown },
    });

    BurgerMenuDropdownHeaderComponent = wrapper.findComponent(
      BurgerMenuDropdownHeader
    );
    BurgerMenuDropdownListComponent = wrapper.findComponent(
      BurgerMenuDropdownList
    );
  });

  describe("BurgerMenuDropdownHeader component:", () => {
    test("is rendered", () => {
      expect(BurgerMenuDropdownHeaderComponent.exists()).toBe(true);
    });

    test("renders its title", () => {
      expect(BurgerMenuDropdownHeaderComponent.text()).toContain(
        dropdown.title
      );
    });

    test("has its 'isDropdownOpen' prop value setted to 'true' at initial render", () => {
      const BurgerMenuDropdownHeaderComponent = wrapper.findComponent(
        BurgerMenuDropdownHeader
      );
      expect(BurgerMenuDropdownHeaderComponent.props("isDropdownOpen")).toBe(
        true
      );
    });

    test("triggers the 'toggle-dropdown' custom event handler and set the 'isDropdownOpen' prop value to 'false'", async () => {
      // Click on the dropdown icon
      const headerIconButtonElement = wrapper.find(
        "[data-testid='burger-menu__dropdown-header-button']"
      );
      await headerIconButtonElement.trigger("click");

      // Assert the custom event handler has been fired by checking the value of the 'isDropdownOpen' prop value of the dropdown header component
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
      expect(BurgerMenuDropdownListComponent.exists()).toBe(true);
    });

    test("has its 'list' prop value well setted", () => {
      expect(BurgerMenuDropdownListComponent.props("items")).toMatchObject(
        dropdown.subMenuItems
      );
    });

    test("is not rendered when the dropdown header icon is clicked", async () => {
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
  });
});
