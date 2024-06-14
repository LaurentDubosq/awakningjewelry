import { mount } from "@vue/test-utils";
import { describe, test, expect, beforeEach } from "vitest";
import SiteHeader from "@/components/SiteHeader.vue";
import CrossIcon from "@/components/icons/IconCross.vue";
import BurgerIcon from "@/components/icons/IconBurger.vue";
import PersonIcon from "@/components/icons/IconPerson.vue";
import CartIcon from "@/components/icons/IconCart.vue";
import SiteLogo from "@/components/SiteLogo.vue";
import SiteNav from "@/components/SiteNav.vue";
import { isBurgerMenuOpenKey } from "@/utils/injectionkeys";

describe("SiteHeader Component:", () => {
  let wrapper;
  let burgerMenuIconButtonElement;

  beforeEach(() => {
    wrapper = mount(SiteHeader, {
      global: {
        provide: {
          [isBurgerMenuOpenKey]: false,
        },
      },
    });
    burgerMenuIconButtonElement = wrapper.find(
      '[data-testid="site-header__burger-menu-icon-button"]'
    );
  });

  describe("BurgerIcon component:", () => {
    test("is rendered", () => {
      const BurgerIconComponent = wrapper.findComponent(BurgerIcon);
      expect(BurgerIconComponent.exists()).toBe(true);
    });

    test("don't render unwanted competitor element/component", () => {
      // Additional test - because of complex logic component - asserts that the cross icon component
      // should not been renders unintentionaly at the same time
      const CrossIconComponent = wrapper.findComponent(CrossIcon);
      expect(CrossIconComponent.exists()).toBe(false);
    });

    test("is wrapped in a button", () => {
      const BurgerIconComponent =
        burgerMenuIconButtonElement.findComponent(BurgerIcon);
      expect(BurgerIconComponent.exists()).toBe(true);
    });

    test("emits the 'toggle-burger-menu' custom event when the burger icon button is clicked", async () => {
      await burgerMenuIconButtonElement.trigger("click");
      expect(wrapper.emitted()).toHaveProperty("toggle-burger-menu");
    });
  });

  describe("CrossIcon component:", () => {
    let wrapper;

    beforeEach(() => {
      // Due to the Vue Test Utils operation, we can't trigger a custom event to toggle the provided value.
      // So we have to set the value manualy. An integration test on the parent component or an E2E test could test the button behavior.
      wrapper = mount(SiteHeader, {
        global: {
          provide: {
            [isBurgerMenuOpenKey]: true,
          },
        },
      });
      burgerMenuIconButtonElement = wrapper.find(
        '[data-testid="site-header__burger-menu-icon-button"]'
      );
    });

    test("is rendered", () => {
      const CrossIconComponent = wrapper.findComponent(CrossIcon);
      expect(CrossIconComponent.exists()).toBe(true);
    });

    test("don't render unwanted competitor element/component", () => {
      // Additional test - because of complex logic component - asserts that the burger icon component
      // should not been renders unintentionaly at the same time
      const BurgerIconComponent = wrapper.findComponent(BurgerIcon);
      expect(BurgerIconComponent.exists()).toBe(false);
    });

    test("is wrapped in a button", () => {
      // Assert the icon is wrapped by a link - because of critical component
      const CrossIconComponent =
        burgerMenuIconButtonElement.findComponent(CrossIcon);
      expect(CrossIconComponent.exists()).toBe(true);
    });

    test("emits the 'toggle-burger-menu' custom event when the cross icon button is clicked", async () => {
      await burgerMenuIconButtonElement.trigger("click");
      expect(wrapper.emitted()).toHaveProperty("toggle-burger-menu");
    });
  });

  describe("SiteLogo component:", () => {
    test("is rendered", () => {
      const SiteLogoComponent = wrapper.findComponent(SiteLogo);
      expect(SiteLogoComponent.exists()).toBe(true);
    });

    test("is wrapped in a link with the expected URL", () => {
      // Assert the icon is wrapped by a link - because of critical component
      const siteLogoLinkElement = wrapper.find(
        '[data-testid="site-header__logo-link"]'
      );
      const SiteLogoComponent = siteLogoLinkElement.findComponent(SiteLogo);

      // Assert the SiteLogo component is wrapped by a link - because of critical component
      expect(SiteLogoComponent.exists()).toBe(true);

      // Assert the SiteLogo component has the expected URL "/"
      expect(siteLogoLinkElement.attributes("to")).toBe("/");
    });
  });

  describe("SiteNav component:", () => {
    test("is rendered", () => {
      const SiteNavComponent = wrapper.findComponent(SiteNav);
      expect(SiteNavComponent.exists()).toBe(true);
    });
  });

  describe("PersonIcon component:", () => {
    test("is rendered", () => {
      // Additional test - because of critical component
      const PersonIconComponent = wrapper.findComponent(PersonIcon);
      expect(PersonIconComponent.exists()).toBe(true);
    });

    test("is wrapped by a link with its URL", () => {
      const personIconLinkElement = wrapper.find(
        "[data-testid='site-header__account-icon-link']"
      );
      const PersonIconComponent =
        personIconLinkElement.findComponent(PersonIcon);

      // Assert the PersonIcon component is wrapped by a link - because of critical component
      expect(PersonIconComponent.exists()).toBe(true);

      // Assert the PersonIcon component has the expected URL "/account"
      expect(personIconLinkElement.attributes("to")).toBe("/account");
    });
  });

  describe("CartIcon component:", () => {
    test("is rendered", () => {
      // Additional test - because of critical component
      const CartIconComponent = wrapper.findComponent(CartIcon);
      expect(CartIconComponent.exists()).toBe(true);
    });

    test("is wrapped by a link with its URL", () => {
      const cartIconLinkElement = wrapper.find(
        "[data-testid='site-header__cart-icon-link']"
      );
      const CartIconComponent = cartIconLinkElement.findComponent(CartIcon);

      // Assert the CartIcon component is wrapped by a link - because of critical component
      expect(CartIconComponent.exists()).toBe(true);

      // Assert the CartIcon component has the expected URL "/cart"
      expect(cartIconLinkElement.attributes("to")).toBe("/cart");
    });
  });
});
