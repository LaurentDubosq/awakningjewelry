import { flushPromises, mount } from "@vue/test-utils";
import { createRouter, createWebHistory, RouterView } from "vue-router";
import { getSiteMenuItems, getPagesMetaData } from "./composables/fetch";
import { useIsOnMobile } from "./composables/display";
import App from "@/App.vue";
import BurgerMenu from "@/components/BurgerMenu.vue";
import SiteHeader from "@/components/SiteHeader.vue";
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

  beforeEach(async () => {
    // Mock the 'siteMenuItems' and 'getPagesMetaData' API calls
    vi.mock("./composables/fetch", () => {
      return {
        getSiteMenuItems: vi.fn(),
        getPagesMetaData: vi.fn(), // Mock necessary to the SiteLogo component render
      };
    });
    getSiteMenuItems.mockReturnValue(siteMenuItems);
    getPagesMetaData.mockReturnValue(pagesMetaData);

    // Mock the UseIsOnMobile composable module because JSDOM doesn't support "window" global object and we need to ensure we are on mobile
    vi.mock("./composables/display", () => {
      return {
        useIsOnMobile: vi.fn(), // Mock necessary to test the 'siteMenuItems' inject
      };
    });
    useIsOnMobile.mockReturnValue(true); // set mobile environment

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
    it("is not rendered at initial render", async () => {
      const BurgerMenuComponent = wrapper.findComponent(BurgerMenu);
      expect(BurgerMenuComponent.exists()).toBe(false);
    });

    it("is rendered when we clic on burger menu icon with its 'siteMenuItems' prop value well setted", async () => {
      // Open the burger menu
      const burgerMenuIconButtonElement = wrapper.find(
        "[data-testid='site-header__burger-menu-icon-button']"
      );
      await burgerMenuIconButtonElement.trigger("click");

      const BurgerMenuComponent = wrapper.findComponent(BurgerMenu);

      // Assert the burger menu is rendered
      expect(BurgerMenuComponent.exists()).toBe(true);

      // Assert it has its 'siteMenuItems' prop value well setted
      expect(BurgerMenuComponent.props("siteMenuItems")).toMatchObject(
        siteMenuItems
      );
    });

    it("is not rendered when a clic emits the 'close-burger-menu' custom event", async () => {
      // Open the burger menu
      const burgerMenuIconButtonElement = wrapper.find(
        "[data-testid='site-header__burger-menu-icon-button']"
      );
      await burgerMenuIconButtonElement.trigger("click");

      // Assert the burger menu is rendered to avoid false positive in next assertion
      const BurgerMenuComponent = wrapper.findComponent(BurgerMenu);
      expect(BurgerMenuComponent.exists()).toBe(true);

      // Click on the first burger menu item link to trigger 'close-burger-menu' custom event
      const firstBurgerMenuItemLink = wrapper.find(
        "[data-testid='burger-menu__link']"
      );
      await firstBurgerMenuItemLink.trigger("click");

      // Assert the burger menu is not rendered
      expect(BurgerMenuComponent.exists()).toBe(false);
    });
  });

  describe("SiteHeader component:", () => {
    test("is rendered", () => {
      const SiteHeaderComponent = wrapper.findComponent(SiteHeader);
      expect(SiteHeaderComponent.exists()).toBe(true);
    });

    test("open the burger when we click on the burger menu icon and closes it at the next click", async () => {
      // Open the burger menu
      const burgerMenuIconButtonElement = wrapper.find(
        "[data-testid='site-header__burger-menu-icon-button']"
      );
      await burgerMenuIconButtonElement.trigger("click");

      // Assert the burger menu is open
      const BurgerMenuComponent = wrapper.findComponent(BurgerMenu);
      expect(BurgerMenuComponent.exists()).toBe(true);

      // Close the burger menu
      await burgerMenuIconButtonElement.trigger("click");

      // Assert the burger menu is open
      expect(BurgerMenuComponent.exists()).toBe(false);
    });
  });

  describe("RouterView built-in component:", () => {
    test("is rendered", () => {
      const RouterViewComponent = wrapper.findComponent(RouterView);
      expect(RouterViewComponent.exists()).toBe(true);
    });
  });

  describe("Providers:", () => {
    test("inject 'siteMenuItems' properly in SiteNav component", async () => {
      // Mock the UseIsOnMobile composable module to ensure we are on desktop
      vi.mock("./composables/display", () => {
        return {
          useIsOnMobile: vi.fn(),
        };
      });
      useIsOnMobile.mockReturnValue(false); // "false" ensure desktop environment

      // Mock's the router during component mount
      wrapper = mount(App, {
        global: {
          plugins: [router],
          stubs: {
            "router-view": true, // avoid a double render of the component
            SiteNav, // stub SiteNav component to import it synchronously instead of asynchronously
          },
        },
      });

      await flushPromises(); // Wait until the siteMenuItems inject has received the data

      // Assert the injected array has been properly received by counting the quantity of item displayed
      const siteNavItemElements = wrapper.findAll(
        "[data-testid='site-nav__list-item']"
      );
      expect(siteNavItemElements).toHaveLength(siteMenuItems.length);
    });

    test("inject 'toggleBurgerMenu' properly in BurgerMenuDropdownList component", async () => {
      // Open the burger menu
      const burgerMenuIconButtonElement = wrapper.find(
        "[data-testid='site-header__burger-menu-icon-button']"
      );
      await burgerMenuIconButtonElement.trigger("click");

      // Assert the burger menu is rendered to avoid false-positive on the next assertion
      const BurgerMenuComponent = wrapper.findComponent(BurgerMenu);
      expect(BurgerMenuComponent.exists()).toBe(true);

      // Close the burger menu using the injected 'toggleBurgerMenu' function
      const burgerMenuDropdownListItemLinkElement = wrapper.find(
        "[data-testid='burger-menu__dropdown-list-item-link']"
      );
      await burgerMenuDropdownListItemLinkElement.trigger("click");

      // Assert the burger menu is not rendered
      expect(BurgerMenuComponent.exists()).toBe(false);
    });

    test("inject 'isBurgerMenuOpen' properly in SiteHeader component", async () => {
      // Open the burger menu to be able to assert using a truthy value
      const burgerMenuIconButtonElement = wrapper.find(
        "[data-testid='site-header__burger-menu-icon-button']"
      );
      await burgerMenuIconButtonElement.trigger("click");

      // Assert the cross icon is rendered
      const CrossIconComponent = wrapper.findComponent(CrossIcon);
      expect(CrossIconComponent.exists()).toBe(true);
    });

    test("inject 'useIsOnMobile' properly in SiteHeader component", () => {
      const siteHeaderAccountIconWrapperElement = wrapper.find(
        "[data-testid='site-header__account-icon-wrapper']"
      );

      // Assert the mobile account icon wrapper rendered on mobile as expected
      expect(siteHeaderAccountIconWrapperElement.exists()).toBe(true);
    });
  });
});
