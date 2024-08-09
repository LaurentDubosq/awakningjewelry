import { flushPromises, mount } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";
import { getSiteMenuItems, getPagesMetaData } from "./composables/fetch";
import { useIsOnMobile } from "./composables/display";
import App from "@/App.vue";
import BurgerMenu from "@/components/BurgerMenu.vue";
import SiteNav from "@/components/SiteNav.vue";
import CrossIcon from "@/components/icons/IconCross.vue";
import frontDataBase from "../db.json";

const siteMenuItems = frontDataBase["siteMenuItems"];
const pagesMetaData = frontDataBase["pagesMetaData"];

describe("App component:", () => {
  let wrapper;

  // Router's mock initialization
  const routes = [
    {
      path: "/",
      component: App,
    },
  ];
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });

  // Mock the 'siteMenuItems' and 'getPagesMetaData' API calls
  vi.mock("./composables/fetch", () => {
    return {
      getSiteMenuItems: vi.fn(),
      getPagesMetaData: vi.fn(),
    };
  });
  getSiteMenuItems.mockReturnValue(siteMenuItems);
  getPagesMetaData.mockReturnValue(pagesMetaData);

  beforeEach(async () => {
    // Reinitialize the mocked router to the Homepage
    router.push("/");
    await router.isReady();

    // Mock's the router during component mount
    wrapper = mount(App, {
      global: {
        plugins: [router],
        stubs: ["router-view"], // avoid a double render of the component
      },
    });
  });

  describe("BurgerMenu component:", () => {
    test("is not rendered at initial render", async () => {
      const BurgerMenuComponent = wrapper.findComponent(BurgerMenu);
      expect(BurgerMenuComponent.exists()).toBe(false);
    });

    test("is rendered when we clic on burger menu icon", async () => {
      // Open the burger menu
      const burgerMenuIconButtonElement = wrapper.find(
        "[data-testid='site-header__burger-menu-icon-button']"
      );
      await burgerMenuIconButtonElement.trigger("click");

      // Assert the burger menu is rendered
      const BurgerMenuComponent = wrapper.findComponent(BurgerMenu);
      expect(BurgerMenuComponent.exists()).toBe(true);
    });
  });

  describe("Providers:", () => {
    test("inject 'siteMenuItems' properly in SiteNav component", async () => {
      // Mock the UseIsOnMobile composable module because JSDOM doesn't support "window" global object and we need to ensure we are on desktop
      vi.mock("./composables/display", () => {
        return {
          useIsOnMobile: vi.fn(),
        };
      });
      useIsOnMobile.mockReturnValue(false); // ensure desktop environment

      // Mock's the router during component mount
      wrapper = mount(App, {
        global: {
          plugins: [router],
          stubs: {
            "router-view": true, // avoid a double render of the component
            SiteNav, // import SiteNav component as Async stub
          },
        },
      });

      await flushPromises();

      // Assert the injected array has been properly received by counting the quantity of item displayed
      const siteNavItemElements = wrapper.findAll(
        "[data-testid='site-nav__list-item']"
      );
      expect(siteNavItemElements).toHaveLength(siteMenuItems.length);
    });

    test("inject 'siteMenuItems' properly in BurgerMenu component", async () => {
      // Open the burger menu
      const burgerMenuIconButtonElement = wrapper.find(
        "[data-testid='site-header__burger-menu-icon-button']"
      );
      await burgerMenuIconButtonElement.trigger("click");

      // Assert the injected array has been properly received by counting the quantity of item displayed
      const burgerMenuItemElements = wrapper.findAll(
        "[data-testid='burger-menu__list-item']"
      );
      expect(burgerMenuItemElements).toHaveLength(siteMenuItems.length);
    });

    test("inject 'toggleBurgerMenu' properly in BurgerMenuDropdownList component", async () => {
      // Open the burger menu
      const burgerMenuIconButtonElement = wrapper.find(
        "[data-testid='site-header__burger-menu-icon-button']"
      );
      await burgerMenuIconButtonElement.trigger("click");

      // Close the burger menu using the injected toggle
      const burgerMenuDropdownListItemLinkElement = wrapper.find(
        "[data-testid='burger-menu__dropdown-list-item-link']"
      );
      await burgerMenuDropdownListItemLinkElement.trigger("click");

      // Assert the burger menu has been closed due to the injected toggle execution
      const BurgerMenuComponent = wrapper.findComponent(BurgerMenu);
      expect(BurgerMenuComponent.exists()).toBe(false);
    });

    test("inject 'isBurgerMenuOpen' properly in SiteHeader component", async () => {
      // Open the burger menu to be able to assert using a truthy value
      const burgerMenuIconButtonElement = wrapper.find(
        "[data-testid='site-header__burger-menu-icon-button']"
      );
      await burgerMenuIconButtonElement.trigger("click");

      // Assert the cross icon is rendered due to the injected boolean true value
      const CrossIconComponent = wrapper.findComponent(CrossIcon);
      expect(CrossIconComponent.exists()).toBe(true);
    });

    test("inject 'useIsOnMobile' properly in SiteHeader component", () => {
      // Mock the UseIsOnMobile composable module because JSDOM doesn't support "window" global object and we need to ensure we are on desktop
      vi.mock("./composables/display", () => {
        return {
          useIsOnMobile: vi.fn(),
        };
      });
      useIsOnMobile.mockReturnValue(false); // set desktop environment

      // Mock's the router during component mount
      wrapper = mount(App, {
        global: {
          plugins: [router],
          stubs: ["router-view"], // avoid a double render of the component
        },
      });

      const siteNavWrapperDivElement = wrapper.find(
        "[data-testid='site-header__site-nav-wrapper']"
      );

      // Assert the Account Icon Wrapper is rendered on mobile
      expect(siteNavWrapperDivElement.exists()).toBe(true);
    });
  });
});
