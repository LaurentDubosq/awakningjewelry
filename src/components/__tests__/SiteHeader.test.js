import { mount } from "@vue/test-utils";
import { isBurgerMenuOpenKey } from "@/utils/injectionkeys";
import { useIsOnMobileKey } from "@/utils/injectionkeys";
import SiteHeader from "@/components/SiteHeader.vue";
import SiteLogo from "@/components/SiteLogo.vue";
import SiteNav from "@/components/SiteNav.vue";
import CrossIcon from "@/components/icons/IconCross.vue";
import BurgerIcon from "@/components/icons/IconBurger.vue";
import PersonIcon from "@/components/icons/IconPerson.vue";
import CartIcon from "@/components/icons/IconCart.vue";

describe("SiteHeader component:", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(SiteHeader, {
      global: {
        provide: {
          [isBurgerMenuOpenKey]: false,
          [useIsOnMobileKey]: true, // set environment on mobile by default
        },
        stubs: {
          SiteNav,
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
      ); // it is easier to target the wrapper instead of a specific element because the burger icon can render two element conditionnaly
      expect(BurgerIconWrapper.exists()).toBe(false);
    });

    test("renders on mobile", () => {
      const BurgerIconWrapper = wrapper.find(
        "[data-testid='site-header__burger-menu-icon-wrapper']"
      ); // it is easier to target the wrapper instead of a specific element because the burger icon can render two element conditionnaly
      expect(BurgerIconWrapper.exists()).toBe(true);
    });

    test("renders the burger icon at initial render (on mobile)", () => {
      const BurgerIconComponent = wrapper.findComponent(BurgerIcon);
      expect(BurgerIconComponent.exists()).toBe(true);
    });

    test("renders the cross icon when the burger menu must be open (on mobile)", () => {
      wrapper = mount(SiteHeader, {
        global: {
          provide: {
            [isBurgerMenuOpenKey]: true, // simulates that the burger menu is open
            [useIsOnMobileKey]: true,
          },
        },
      });
      const CrossIconComponent = wrapper.findComponent(CrossIcon);
      expect(CrossIconComponent.exists()).toBe(true);
    });

    test("emits its 'toggle-burger-menu' custom event when its button is clicked (on mobile)", async () => {
      const buttonElement = wrapper.find(
        '[data-testid="site-header__burger-menu-icon-button"]'
      );
      await buttonElement.trigger("click");
      expect(wrapper.emitted("toggle-burger-menu")).toHaveLength(1);
    });
  });

  describe("Site logo:", () => {
    test("is rendered", () => {
      const SiteLogoComponent = wrapper.findComponent(SiteLogo);
      expect(SiteLogoComponent.exists()).toBe(true);
    });

    it("has a link with its url value setted to '/'", () => {
      const linkElement = wrapper.find(
        "[data-testid='site-header__logo-link']"
      );

      // Assert the logo has a link tag
      expect(linkElement.exists()).toBe(true);

      // Assert the logo has its link value well setted
      expect(linkElement.attributes("to")).toBe("/");
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
          stubs: {
            SiteNav,
          },
        },
      });

      const siteNavComponent = wrapper.findComponent(SiteNav);
      expect(siteNavComponent.exists()).toBe(true);
    });

    test("is not rendered on mobile", () => {
      const siteNavComponent = wrapper.findComponent(SiteNav);
      expect(siteNavComponent.exists()).toBe(false);
    });
  });

  describe("Account Icon", () => {
    test("is rendered on mobile", () => {
      const PersonIconComponent = wrapper.findComponent(PersonIcon);
      expect(PersonIconComponent.exists()).toBe(true);
    });

    it("has a link with its url value setted to '/account'", () => {
      const linkElement = wrapper.find(
        "[data-testid='site-header__account-icon-link']"
      );

      // Assert the icon has a link tag
      expect(linkElement.exists()).toBe(true);

      // Assert the icon has its link value well setted
      expect(linkElement.attributes("to")).toBe("/account");
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
      const PersonIconComponent = wrapper.findComponent(PersonIcon);
      expect(PersonIconComponent.exists()).toBe(false);
    });
  });

  describe("Cart Icon", () => {
    test("is rendered ", () => {
      const CartIconComponent = wrapper.findComponent(CartIcon);
      expect(CartIconComponent.exists()).toBe(true);
    });

    it("has a link with its url value setted to '/cart'", () => {
      const linkElement = wrapper.find(
        "[data-testid='site-header__cart-icon-link']"
      );

      // Assert the icon has a link tag
      expect(linkElement.exists()).toBe(true);

      // Assert the icon has its link value well setted
      expect(linkElement.attributes("to")).toBe("/cart");
    });
  });
});
