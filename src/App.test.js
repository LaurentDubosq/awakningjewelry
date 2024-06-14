import { mount } from "@vue/test-utils";
import { describe, test, expect, beforeEach } from "vitest";
import { createRouter, createWebHistory } from "vue-router";
import App from "@/App.vue";
import BurgerMenu from "@/components/BurgerMenu.vue";

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

describe("App component:", () => {
  let wrapper;

  beforeEach(async () => {
    router.push("/");
    await router.isReady();
    wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    });
  });

  describe("BurgerMenu component:", () => {
    test("is not rendered at initial render", async () => {
      // additional test - because of critical component
      const BurgerMenuComponent = wrapper.findComponent(BurgerMenu);
      expect(BurgerMenuComponent.exists()).toBe(false);
    });
  });

  describe("SiteHeader component:", () => {
    test("renders BurgerMenu component when burger menu icon button is clicked", async () => {
      const burgerMenuIconButton = wrapper.find(
        "[data-testid='site-header__burger-menu-icon-button']"
      );

      await burgerMenuIconButton.trigger("click");

      const BurgerMenuComponent = wrapper.findComponent(BurgerMenu);
      expect(BurgerMenuComponent.exists()).toBe(true);
    });
  });
});
