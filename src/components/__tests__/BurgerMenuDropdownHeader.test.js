import { mount } from "@vue/test-utils";
import BurgerMenuDropdownHeader from "@/components/BurgerMenuDropdownHeader.vue";
import IconSignMinus from "@/components/icons/IconSignMinus.vue";
import IconSignPlus from "@/components/icons/IconSignPlus.vue";
import frontDataBase from "../../../db.json";
import SASSCONSTANTS from "@/assets/styles/_constants.module.scss";

const siteMenuItems = frontDataBase["siteMenuItems"];
const title = siteMenuItems[1].title;
const COLORWHITE = SASSCONSTANTS.AwakningColorWhite;

describe("BurgerMenuDropdownHeader component:", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(BurgerMenuDropdownHeader, {
      props: { isDropdownOpen: true },
      slots: { default: title },
    });
  });

  test("renders its title", () => {
    expect(wrapper.text()).toContain(title);
  });

  describe("Icon:", () => {
    test("renders IconSignMinus component at initial render with its 'color' prop value", () => {
      const IconSignMinusComponent = wrapper.findComponent(IconSignMinus);

      // Assert the component is rendered
      expect(IconSignMinusComponent.exists()).toBe(true);

      // Assert the 'color' prop value is well setted
      expect(IconSignMinusComponent.props("color")).toBe(COLORWHITE);
    });

    test("renders IconSignPlus component with its 'color' prop value when the dropdown must be closed", () => {
      wrapper = mount(BurgerMenuDropdownHeader, {
        props: { isDropdownOpen: false },
      });
      const IconSignPlusComponent = wrapper.findComponent(IconSignPlus);

      // Assert the component is rendered
      expect(IconSignPlusComponent.exists()).toBe(true);

      // Assert the 'color' prop value is well setted
      expect(IconSignPlusComponent.props("color")).toBe(COLORWHITE);
    });

    test("emits 'toggle-dropdown' custom event when the icon's button is clicked", async () => {
      const buttonElement = wrapper.find(
        "[data-testid='burger-menu__dropdown-header-button']"
      );
      await buttonElement.trigger("click");
      expect(wrapper.emitted()).toHaveProperty("toggle-dropdown");
    });
  });
});
