import { mount } from "@vue/test-utils";
import { isBurgerMenuOpenKey } from "@/utils/injectionkeys";
import { useIsOnMobileKey } from "@/utils/injectionkeys";
import SiteHeader from "@/components/SiteHeader.vue";
import CrossIcon from "@/components/icons/IconCross.vue";
import BurgerIcon from "@/components/icons/IconBurger.vue";

describe("SiteHeader component:", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(SiteHeader, {
      global: {
        provide: {
          [isBurgerMenuOpenKey]: false,
          [useIsOnMobileKey]: true, // set environment on mobile by default
        },
      },
    });
  });

  describe("Burger Menu Icon:", () => {
    test("emits its custom event when its button is clicked", async () => {
      const burgerMenuIconButtonElement = wrapper.find(
        '[data-testid="site-header__burger-menu-icon-button"]'
      );
      await burgerMenuIconButtonElement.trigger("click");
      expect(wrapper.emitted()).toHaveProperty("toggle-burger-menu");
    });

    test("renders the burger icon at initial render", () => {
      const BurgerIconComponent = wrapper.findComponent(BurgerIcon);
      expect(BurgerIconComponent.exists()).toBe(true);
    });

    test("renders the cross icon when the burger menu must be open", () => {
      wrapper = mount(SiteHeader, {
        global: {
          provide: {
            [isBurgerMenuOpenKey]: true,
          },
        },
      });
      const CrossIconComponent = wrapper.findComponent(CrossIcon);
      expect(CrossIconComponent.exists()).toBe(true);
    });
  });

  describe("Site Navigation:", () => {
    test("is rendered on desktop", () => {
      wrapper = mount(SiteHeader, {
        global: {
          provide: {
            [isBurgerMenuOpenKey]: false,
            [useIsOnMobileKey]: false, // set environment on desktop
          },
        },
      });

      const siteNavWrapperDivElement = wrapper.find(
        "[data-testid='site-header__site-nav-wrapper']"
      );
      expect(siteNavWrapperDivElement.exists()).toBe(true);
    });

    test("is not rendered on mobile", () => {
      const siteNavWrapperDivElement = wrapper.find(
        "[data-testid='site-header__site-nav-wrapper']"
      );
      expect(siteNavWrapperDivElement.exists()).toBe(false);
    });
  });
});
