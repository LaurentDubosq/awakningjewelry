import { mount } from "@vue/test-utils";
import { isBurgerMenuOpenKey } from "@/utils/injectionkeys";
import { useIsOnMobileKey } from "@/utils/injectionkeys";
import SiteHeader from "@/components/SiteHeader.vue";
import SiteLogo from "@/components/SiteLogo.vue";
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
    test("don't renders on desktop", () => {
      wrapper = mount(SiteHeader, {
        global: {
          provide: {
            [isBurgerMenuOpenKey]: false,
            [useIsOnMobileKey]: false, // set environment on desktop
          },
        },
      });
      const BurgerIconWrapper = wrapper.find(
        "[data-testid='site-header__burger-menu-icon-wrapper']"
      );
      expect(BurgerIconWrapper.exists()).toBe(false);
    });

    test("renders the burger icon at initial render on mobile", () => {
      const BurgerIconComponent = wrapper.findComponent(BurgerIcon);
      expect(BurgerIconComponent.exists()).toBe(true);
    });

    test("renders the cross icon when the burger menu must be open", () => {
      wrapper = mount(SiteHeader, {
        global: {
          provide: {
            [isBurgerMenuOpenKey]: true,
            [useIsOnMobileKey]: true, // set environment on mobile by default
          },
        },
      });
      const CrossIconComponent = wrapper.findComponent(CrossIcon);
      expect(CrossIconComponent.exists()).toBe(true);
    });

    test("emits its custom event when its button is clicked", async () => {
      const burgerMenuIconButtonElement = wrapper.find(
        '[data-testid="site-header__burger-menu-icon-button"]'
      );
      await burgerMenuIconButtonElement.trigger("click");
      expect(wrapper.emitted()).toHaveProperty("toggle-burger-menu");
    });
  });

  describe("Site logo:", () => {
    test("is rendered with its '/' expected link", () => {
      // Assert the logo is rendered
      const SiteLogoComponent = wrapper.findComponent(SiteLogo);
      expect(SiteLogoComponent.exists()).toBe(true);

      // Assert the logo's link is well setted to "/"
      const siteLogoLinkElement = wrapper.find(
        "[data-testid='site-header__logo-link']"
      );
      expect(siteLogoLinkElement.attributes("to")).toBe("/");
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

  describe("Account Icon", () => {
    test("is rendered on mobile with its '/account' link", () => {
      // Assert the Account Icon is rendered
      const accountIconWrapperElement = wrapper.find(
        "[data-testid='site-header__account-icon-wrapper']"
      );
      expect(accountIconWrapperElement.exists()).toBe(true);

      // Assert the Account Icon link is setted to "/account"
      const accountIconLinkElement = wrapper.find(
        "[data-testid='site-header__account-icon-link']"
      );
      expect(accountIconLinkElement.attributes("to")).toBe("/account");
    });

    test("is not rendered on desktop", () => {
      wrapper = mount(SiteHeader, {
        global: {
          provide: {
            [isBurgerMenuOpenKey]: false,
            [useIsOnMobileKey]: false, // set environment on desktop
          },
        },
      });
      const accountIconWrapperElement = wrapper.find(
        "[data-testid='site-header__account-icon-wrapper']"
      );
      expect(accountIconWrapperElement.exists()).toBe(false);
    });
  });

  describe("Cart Icon", () => {
    test("is rendered with its '/cart' link", () => {
      // Assert the Cart Icon is rendered
      const cartIconWrapperElement = wrapper.find(
        "[data-testid='site-header__cart-icon-wrapper']"
      );
      expect(cartIconWrapperElement.exists()).toBe(true);

      // Assert the Cart Icon link is setted to "/cart"
      const cartIconLinkElement = wrapper.find(
        "[data-testid='site-header__cart-icon-link']"
      );
      expect(cartIconLinkElement.attributes("to")).toBe("/cart");
    });
  });
});
