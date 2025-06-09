import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import App from '@/App.vue'
import BurgerMenu from '@/components/BurgerMenu.vue'
import SiteHeader from '@/components/SiteHeader.vue'
import SiteNav from '@/components/SiteNav.vue'
import { RouterView } from 'vue-router'
import { nextTick, ref, computed, defineComponent } from 'vue'
import { defineStore } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import frontDataBase from '../db.json'

/*********************/
/* 1.Initializations */
/*********************/

/* Router */

const mockRouter = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      component: defineComponent({
        template: '<div>Mocked Component</div>',
      }),
    },
  ],
})

/* Data */

const mockSiteMenuPending = {
  data: undefined,
  status: 'pending',
}
const mockSiteMenuFulfilled = {
  data: frontDataBase.siteMenu,
  status: 'fulfilled',
}

/* Stores */

// Initialize a testing pinia instance
const mockPinia = createTestingPinia({ stubActions: false })

// Create the stores
const mockUseIsOnMobileStore = defineStore('IsOnMobile', () => {
  const isOnMobile = ref()
  return { isOnMobile }
})
const mockUseIsBurgerMenuOpenStore = defineStore('IsBurgerMenuOpen', () => {
  const isBurgerMenuOpen = ref(false)
  const toggleBurgerMenu = () => {
    isBurgerMenuOpen.value = !isBurgerMenuOpen.value
  }
  return { isBurgerMenuOpen, toggleBurgerMenu }
})
const mockUseSiteMenuStore = defineStore('SiteMenu', () => {
  const siteMenuResult = ref(mockSiteMenuPending)
  const siteMenu = computed(() => siteMenuResult.value.data)
  const siteMenuFetchState = computed(() => siteMenuResult.value.status)
  return {
    siteMenuResult,
    siteMenu,
    siteMenuFetchState,
  }
})

// Initialize the stores
const mockIsOnMobileStore = mockUseIsOnMobileStore()
const mockIsBurgerMenuOpenStore = mockUseIsBurgerMenuOpenStore()
const mockSiteMenuStore = mockUseSiteMenuStore()

/***********/
/* 2.Build */
/***********/

// Component Factory (Neutral environment state - Burger menu close state - Data fetching "Pending" state)
function mountApp() {
  return mount(App, {
    attachTo: document.body,
    global: {
      plugins: [mockRouter, mockPinia],
      stubs: {
        SiteNav,
        'router-view': true,
      },
    },
  })
}

/**********/
/* 3.Test */
/**********/

// WARNING : The component has 2 states regarding the environment state. Mobile or desktop. There is none used by default.

// WARNING : The component has 2 states regarding the burger menu status. Open or close. The state by default is close.

// WARNING : The component has 3 states regarding the data fetching status. "Pending", "Rejected" and "Fulfilled". The state by default is "Pending".

describe('App.vue', () => {
  let wrapper
  let clickEventTriggeredByEnter

  beforeEach(async () => {
    // Component mounting (Neutral environment state - Burger menu close state - Data fetching "Pending" state)
    wrapper = mountApp()
  })

  afterEach(() => {
    // Reset the store(s) state(s) to default to ensure a clean environment for each test
    mockIsOnMobileStore.isOnMobile = undefined
    mockIsBurgerMenuOpenStore.isBurgerMenuOpen = false
    mockSiteMenuStore.siteMenuResult = mockSiteMenuPending

    // Reset event(s) to avoid alteration over time
    clickEventTriggeredByEnter = new MouseEvent('click', { detail: 0 })
  })

  // Smoke test
  test('mounts successfully', async () => {
    // Assert the wrapper component is well mounted at initial render
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('Initial render - Neutral environment state - Burger menu close state - Data fetching "Pending" state', () => {
    test('renders the site header', () => {
      const SiteHeaderComponent = wrapper.findComponent(SiteHeader)
      expect(SiteHeaderComponent.exists()).toBeTruthy()
    })

    test('implements RouterView built-in component', () => {
      const RouterViewComponent = wrapper.findComponent(RouterView)
      expect(RouterViewComponent.exists()).toBeTruthy()
    })
  })

  describe('Mobile environment state - Burger menu close state - Data fetching "Fulfilled" state', () => {
    beforeEach(async () => {
      // Set the environment to mobile
      mockIsOnMobileStore.isOnMobile = true

      // Set the store data fetching status to "fulfilled"
      mockSiteMenuStore.siteMenuResult = mockSiteMenuFulfilled
      await nextTick()
    })

    describe('Burger menu close state - Data fetching "Fulfilled" state', () => {
      test("don't renders the burger menu", () => {
        // Asser the burger menu is rendered
        const BurgerMenuComponent = wrapper.findComponent(BurgerMenu)
        expect(BurgerMenuComponent.isVisible()).toBeFalsy()
      })
    })

    describe('Burger menu open state - Data fetching "Fulfilled" state', () => {
      beforeEach(async () => {
        // Open the burger menu (short way)
        mockIsBurgerMenuOpenStore.isBurgerMenuOpen = true
        await nextTick()
      })

      test('renders the burger menu', () => {
        // Asser the burger menu is rendered
        const BurgerMenuComponent = wrapper.findComponent(BurgerMenu)
        expect(BurgerMenuComponent.isVisible()).toBeTruthy()
      })
    })
  })

  describe('Behaviors:', () => {
    beforeEach(async () => {
      // Set the environment to mobile
      mockIsOnMobileStore.isOnMobile = true

      // Set the store data fetching status to "fulfilled"
      mockSiteMenuStore.siteMenuResult = mockSiteMenuFulfilled
      await nextTick()
    })

    /***************/
    /* Burger menu */
    /***************/

    test('The burger menu is close by default', async () => {
      const BurgerMenuComponent = wrapper.findComponent(BurgerMenu)
      expect(BurgerMenuComponent.isVisible()).toBeFalsy()
    })

    test('when each burger menu focusable element is focused and the "Escape" key is pressed, it closes the burger menu', async () => {
      let BurgerMenuComponent

      // Open the burger menu (short way)
      mockIsBurgerMenuOpenStore.isBurgerMenuOpen = true
      await nextTick()

      // Assert the burger menu is open
      BurgerMenuComponent = wrapper.findComponent(BurgerMenu)
      expect(BurgerMenuComponent.isVisible()).toBeTruthy()

      // Finds the focusable elements
      const focusableElements = BurgerMenuComponent.findAll('button, a')

      // Assert each focusable element close the burger menu
      for (const element of focusableElements) {
        // Reset the burger menu to open
        mockIsBurgerMenuOpenStore.isBurgerMenuOpen = true
        await nextTick()

        // Focus the element
        element.element.focus() // this method guarantee that the DOM element will be focused

        // Press the "escape" key
        await element.trigger('keydown.escape')

        // Assert the burger menu is close
        BurgerMenuComponent = wrapper.findComponent(BurgerMenu)
        expect(BurgerMenuComponent.isVisible()).toBeFalsy()
      }
    })

    /*****************************/
    /* Burger menu toggle button */
    /*****************************/

    test('when we touch the burger menu toggle button, it open/close the burger menu', async () => {
      let burgerMenuToggleButton
      let BurgerMenuComponent

      // Open the burger menu by a touch
      burgerMenuToggleButton = wrapper.find("[data-testid='site-header__burger-menu-toggle']")
      await burgerMenuToggleButton.trigger('click')

      // Assert the burger menu is open
      BurgerMenuComponent = wrapper.findComponent(BurgerMenu)
      expect(BurgerMenuComponent.isVisible()).toBeTruthy()

      // Touch on the button again
      burgerMenuToggleButton = wrapper.find("[data-testid='site-header__burger-menu-toggle']")
      await burgerMenuToggleButton.trigger('click')

      // Assert the burger menu is close
      BurgerMenuComponent = wrapper.findComponent(BurgerMenu)
      expect(BurgerMenuComponent.isVisible()).toBeFalsy()
    })

    test('when we press the "Enter" key on the burger menu toggle button, it opens the burger menu then focus the first focusable element', async () => {
      // Open the burger menu by pressing the "enter" key
      const burgerMenuToggleButton = wrapper.find("[data-testid='site-header__burger-menu-toggle']")
      burgerMenuToggleButton.element.dispatchEvent(clickEventTriggeredByEnter)
      await nextTick()

      // Assert the burger menu is open
      const BurgerMenuComponent = wrapper.findComponent(BurgerMenu)
      expect(BurgerMenuComponent.isVisible()).toBeTruthy()

      // Assert the first focusable element is focused
      const firstBurgerMenuFocusableElement = BurgerMenuComponent.find('button, a')
      expect(document.activeElement).toStrictEqual(firstBurgerMenuFocusableElement.element)
    })

    test('when the burger menu is open and the focus is on the burger menu toggle button, it closes the burger menu when pressing "Enter", then keeps the focus on the burger menu toggle button', async () => {
      let BurgerMenuComponent

      // Open the burger menu (short way)
      mockIsBurgerMenuOpenStore.isBurgerMenuOpen = true
      await nextTick()

      // Assert the burger menu is open
      BurgerMenuComponent = wrapper.findComponent(BurgerMenu)
      expect(BurgerMenuComponent.isVisible()).toBeTruthy()

      // Focus the burger menu toggle button (it corresponds to keyboard navigation that ends on the burger menu toggle button)
      const burgerMenuToggleButton = wrapper.find("[data-testid='site-header__burger-menu-toggle']")
      burgerMenuToggleButton.element.focus() // this method guarantee that the DOM element will be focused

      // Press "Enter" on the burger menu toggle button again
      burgerMenuToggleButton.element.dispatchEvent(clickEventTriggeredByEnter)
      await nextTick()

      // Assert the burger menu is close
      BurgerMenuComponent = wrapper.findComponent(BurgerMenu)
      expect(BurgerMenuComponent.isVisible()).toBeFalsy()

      // Assert the burger menu toggle button is still focused
      expect(document.activeElement).toStrictEqual(burgerMenuToggleButton.element)
    })

    /*********************/
    /* Burger menu links */
    /*********************/

    test('when each burger menu link is touched, it closes the burger menu', async () => {
      let BurgerMenuComponent

      // Open the burger menu (short way)
      mockIsBurgerMenuOpenStore.isBurgerMenuOpen = true
      await nextTick()

      // Assert the burger menu is open
      BurgerMenuComponent = wrapper.findComponent(BurgerMenu)
      expect(BurgerMenuComponent.isVisible()).toBeTruthy()

      // Find the links
      const links = wrapper.findAll("[data-testid='burger-menu__link']")

      // Assert each link closes the burger menu
      for (let index; index < links.length; index++) {
        // Reopen the burger menu (short way)
        mockIsBurgerMenuOpenStore.isBurgerMenuOpen = true
        await nextTick()

        // Assert the burger menu is open
        BurgerMenuComponent = wrapper.findComponent(BurgerMenu)
        expect(BurgerMenuComponent.isVisible()).toBeTruthy()

        // Touch the link
        await links[index].trigger('click')

        // Assert the burger menu is close
        BurgerMenuComponent = wrapper.findComponent(BurgerMenu)
        expect(BurgerMenuComponent.isVisible()).toBeFalsy()
      }
    })

    /******************************/
    /* Burger menu dropdown links */
    /******************************/

    test('when each burger menu dropdown link is touched, it closes the burger menu', async () => {
      let BurgerMenuComponent

      // Open the burger menu (short way)
      mockIsBurgerMenuOpenStore.isBurgerMenuOpen = true
      await nextTick()

      // Assert the burger menu is open
      BurgerMenuComponent = wrapper.findComponent(BurgerMenu)
      expect(BurgerMenuComponent.isVisible()).toBeTruthy()

      // Find the links
      const links = wrapper.findAll("[data-testid='burger-menu__dropdown-item-link']")

      // Assert each link closes the burger menu
      for (let index = 0; index < links.length; index++) {
        // Reopen the burger menu (short way)
        mockIsBurgerMenuOpenStore.isBurgerMenuOpen = true
        await nextTick()

        // Assert the burger menu is open
        BurgerMenuComponent = wrapper.findComponent(BurgerMenu)
        expect(BurgerMenuComponent.isVisible()).toBeTruthy()

        // Touch the link
        await links[index].trigger('click')

        // Assert the burger menu is close
        BurgerMenuComponent = wrapper.findComponent(BurgerMenu)
        expect(BurgerMenuComponent.isVisible()).toBeFalsy()
      }
    })
  })

  describe('Initial render - All child components stubbed:', () => {
    test('app component has NOT been improperly modified', async () => {
      // Remount the component to focus on App.vue structure only (by excluding all child components)
      const wrapper = mount(App, {
        global: {
          stubs: {
            BurgerMenu: true,
            SiteHeader: true,
            'router-view': true,
          },
        },
      })

      expect(wrapper.html()).toMatchInlineSnapshot(`
        "<div data-v-7a7a37b1="" class="site-container">
          <transition-stub data-v-7a7a37b1="" name="marginLeftMinus300px" appear="false" persisted="false" css="true">
            <burger-menu-stub data-v-7a7a37b1="" style="display: none;"></burger-menu-stub>
          </transition-stub>
          <div data-v-7a7a37b1="" class="site-content">
            <div data-v-7a7a37b1="" class="site-content-container">
              <site-header-stub data-v-7a7a37b1=""></site-header-stub>
              <main data-v-7a7a37b1="">
                <router-view-stub data-v-7a7a37b1="" name="default"></router-view-stub>
              </main>
            </div>
          </div>
        </div>"
      `)
    })
  })
})
