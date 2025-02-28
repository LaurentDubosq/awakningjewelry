import { getSiteMenu } from '@/data/dataFetchers'
import { createTestingPinia } from '@pinia/testing'
import router from '@/router'
import { flushPromises, mount } from '@vue/test-utils'
import App from '@/App.vue'
import BurgerMenu from '@/components/BurgerMenu.vue'
import SiteHeader from '@/components/SiteHeader.vue'
import SiteNav from '@/components/SiteNav.vue'
import { RouterView } from 'vue-router'
import { nextTick, ref } from 'vue'
import { defineStore } from 'pinia'

/************/
/* Hoisting */
/************/

// Initialize variables able to work with "vi.mock" for the following "getPagesMetaData" mock
var frontDataBase
var mockPagesMetaData

// Mocks fetchers with data
vi.mock('@/data/dataFetchers', async () => {
  // Necessary method to provide data to "getPagesMetaData" fetcher
  frontDataBase = await import('../db.json')
  mockPagesMetaData = frontDataBase['pagesMetaData']

  return {
    getPagesMetaData: vi.fn().mockReturnValue(mockPagesMetaData),
    getSiteMenu: vi.fn(),
  }
})

/*******************/
/* Initializations */
/*******************/

/* Data */
const mockSiteMenuResult = {
  data: { value: frontDataBase['siteMenu'] },
  status: { value: 'resolved' },
}

/* Stores */

// Initialize a testing pinia instance
const pinia = createTestingPinia()

// Create the stores
const useIsOnMobileStore = defineStore('IsOnMobile', () => {
  const isOnMobile = ref(true)
  return { isOnMobile }
})

// Initialize the stores
const isOnMobileStore = useIsOnMobileStore()

/*******************************/
/* Additional Mock Assignation */
/*******************************/

getSiteMenu.mockReturnValue(mockSiteMenuResult)

/*********/
/* Build */
/*********/

// Component Factory
function mountApp() {
  return mount(App, {
    attachTo: document.body,
    global: {
      plugins: [router, pinia],
      stubs: {
        'router-view': true,
        SiteNav,
      },
    },
    attachTo: document.body,
  })
}

/********/
/* Test */
/********/

describe('App.vue', () => {
  let wrapper

  beforeEach(async () => {
    isOnMobileStore.isOnMobile = true // reset the environment to mobile
    wrapper = mountApp()
  })

  afterEach(() => {
    wrapper.unmount()
  })

  // Smoke test
  test('mounts successfully', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  /***************/
  /* Burger Menu */
  /***************/

  describe('BurgerMenu.vue', () => {
    it('is not rendered at initial render', async () => {
      const BurgerMenuComponent = wrapper.findComponent(BurgerMenu)
      expect(BurgerMenuComponent.isVisible()).toBeFalsy()
    })

    describe('Behaviors:', () => {
      describe('When open:', () => {
        let button
        let clickEvent
        let BurgerMenuComponent

        beforeEach(async () => {
          // Open the burger menu
          button = wrapper.find("[data-testid='site-header__burger-menu-toggle']")
          clickEvent = new MouseEvent('click', { detail: 1 }) // Necessary to customize "detail" option
          await button.element.dispatchEvent(clickEvent)

          // Find the burger menu component
          BurgerMenuComponent = wrapper.findComponent(BurgerMenu)
        })

        it('is rendered with necessary information', async () => {
          // Assert the burger menu component is rendered
          expect(BurgerMenuComponent.isVisible()).toBeTruthy()

          // Assert its 'siteMenuResult' prop value is well setted
          expect(BurgerMenuComponent.props('siteMenuResult')).toMatchObject(mockSiteMenuResult)
        })

        test('when a link is clicked, it closes the burger menu', async () => {
          // Assert the burger menu is open
          expect(BurgerMenuComponent.isVisible()).toBeTruthy()

          // Click a link
          const link = wrapper.find("[data-testid='burger-menu__link']")
          await link.trigger('click')

          // Assert the burger menu is close
          expect(BurgerMenuComponent.isVisible()).toBeFalsy()
        })

        test('when a dropdown link is clicked, it closes the burger menu', async () => {
          // Assert the burger menu is open
          expect(BurgerMenuComponent.isVisible()).toBeTruthy()

          // Click a dropdown link
          const link = wrapper.find("[data-testid='burger-menu__dropdown-item-link']")
          await link.trigger('click')

          // Assert the burger menu is close
          expect(BurgerMenuComponent.isVisible()).toBeFalsy()
        })

        test('when a focusable element is focused and the Escape key is pressed, it closes the burger menu', async () => {
          // Assert the burger menu is open
          expect(BurgerMenuComponent.isVisible()).toBeTruthy()

          // Focus a link
          const link = wrapper.find("[data-testid='burger-menu__dropdown-item-link']")
          await link.trigger('focus')

          // Press the Escape key
          await link.trigger('keydown.escape')

          // Assert the burger menu is close
          expect(BurgerMenuComponent.isVisible()).toBeFalsy()
        })
      })
    })
  })

  /***************/
  /* Site Header */
  /***************/

  describe('SiteHeader.vue', () => {
    test('is rendered', () => {
      const SiteHeaderComponent = wrapper.findComponent(SiteHeader)
      expect(SiteHeaderComponent.exists()).toBeTruthy()
    })

    describe('Behaviors:', () => {
      test('when the burger menu is close, it renders the toggle burger icon', () => {
        const icon = wrapper.find("[data-testid='icon-burger']")
        expect(icon.exists()).toBeTruthy()
      })

      test('when the burger menu is open, it renders the toggle cross icon', async () => {
        // Open the burger menu
        const button = wrapper.find("[data-testid='site-header__burger-menu-toggle']")
        await button.trigger('click')

        // Assert the burger menu is open
        const BurgerMenuComponent = wrapper.findComponent(BurgerMenu)
        expect(BurgerMenuComponent.isVisible()).toBeTruthy()

        // Assert the cross icon is rendered
        const icon = wrapper.find("[data-testid='icon-cross']")
        expect(icon.exists()).toBeTruthy()
      })

      test('when we click on burger menu toggle icon, open/close the burger menu', async () => {
        // Find the burger menu toggle button
        const button = wrapper.find("[data-testid='site-header__burger-menu-toggle']")

        // Click on the button
        const clickEvent = new MouseEvent('click', { detail: 1 }) // Necessary to customize "detail" option
        await button.element.dispatchEvent(clickEvent)

        // Find the burger menu component
        const BurgerMenuComponent = wrapper.findComponent(BurgerMenu)

        // Assert the burger menu is open
        expect(BurgerMenuComponent.isVisible()).toBeTruthy()

        // Click on the button
        await button.element.dispatchEvent(clickEvent)

        // Assert the burger menu is close
        expect(BurgerMenuComponent.isVisible()).toBeFalsy()
      })

      test('when we press the Enter key on the burger menu toggle button, it opens the burger menu then focus the first focusable element', async () => {
        // Find the burger menu toggle button
        const button = wrapper.find("[data-testid='site-header__burger-menu-toggle']")

        // Press Enter on the button to open the burger menu
        const clickEvent = new MouseEvent('click', { detail: 0 }) // simulate an "enter" key pressed
        await button.element.dispatchEvent(clickEvent)
        await nextTick()

        // Find the burger menu component
        const BurgerMenuComponent = wrapper.findComponent(BurgerMenu)

        // Assert the burger menu is open
        expect(BurgerMenuComponent.isVisible()).toBeTruthy()

        // Find the first focusable element
        const focusedElement = BurgerMenuComponent.find('button, a')

        // Assert the first focusable element is focused
        expect(document.activeElement).toStrictEqual(focusedElement.element)
      })

      test('when the burger menu is open and the focus is on the burger toggle icon, it closes the burger menu when pressing Enter, then keeps the focus on the toggle', async () => {
        // Get the burger menu toggle button
        const button = wrapper.find("[data-testid='site-header__burger-menu-toggle']")

        // Open the burger menu
        const clickEvent = new MouseEvent('click', { detail: 0 }) // simulate an "enter" key pressed
        await button.element.dispatchEvent(clickEvent)
        await nextTick()

        // Find the burger menu component
        const BurgerMenuComponent = wrapper.findComponent(BurgerMenu)

        // Assert the burger menu is open
        expect(BurgerMenuComponent.isVisible()).toBeTruthy()

        // Focus the button
        button.element.focus() // this method forces the focus because the useFocusElement's focus appropriated control

        // Press Enter on the button to close the burger menu
        await button.element.dispatchEvent(clickEvent)
        await nextTick()

        // Assert the burger menu is close
        expect(BurgerMenuComponent.isVisible()).toBeFalsy()

        // Assert the button is still focused
        expect(document.activeElement).toStrictEqual(button.element)
      })
    })
  })

  /************/
  /* Site Nav */
  /************/

  describe('SiteNav.vue', () => {
    test("send properly the 'siteMenu' through 'siteMenu' provider by testing the first site navigation item display", async () => {
      // Set the desktop environment
      isOnMobileStore.isOnMobile = false

      // Remount the component with environment updated
      wrapper = mountApp()

      // Wait after the SiteNav async import has been resolved after the component mounting
      await flushPromises()

      // Find the item
      const item = wrapper.find("[data-testid='site-nav__item']")

      // Assert the site menu is rendered
      expect(item.exists()).toBeTruthy()
    })
  })

  /**************/
  /* RouterView */
  /**************/

  describe('RouterView built-in component:', () => {
    test('is rendered', () => {
      const RouterViewComponent = wrapper.findComponent(RouterView)
      expect(RouterViewComponent.exists()).toBeTruthy()
    })
  })

  /*******/
  /* App */
  /*******/

  // Snapshot test
  test('app component has not been improperly modified', async () => {
    // Remount the component to focus on App.vue structure (by excluding child components)
    wrapper = mount(App, {
      global: {
        stubs: {
          BurgerMenu: true,
          SiteHeader: true,
          'router-view': true,
        },
      },
    })

    // Open the burger menu
    wrapper.vm.toggleBurgerMenu()
    await nextTick()

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div data-v-7a7a37b1="" class="site-container">
        <transition-stub data-v-7a7a37b1="" name="marginLeftMinus300px" appear="false" persisted="false" css="true">
          <burger-menu-stub data-v-7a7a37b1="" sitemenuresult="[object Object]" style=""></burger-menu-stub>
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
