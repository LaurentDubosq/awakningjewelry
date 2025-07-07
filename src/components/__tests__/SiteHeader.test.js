import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import SiteHeader from '@/components/SiteHeader.vue'
import BurgerMenuToggle from '@/components/BurgerMenuToggle.vue'
import SiteLogo from '@/components/SiteLogo.vue'
import SiteNav from '@/components/SiteNav.vue'
import { createTestingPinia } from '@pinia/testing'
import { defineStore } from 'pinia'
import { nextTick, ref } from 'vue'

/********************/
/* 1.Initialization */
/********************/

// Initialize a testing pinia instance
const mockPinia = createTestingPinia()

// Create the stores
const mockUseIsOnMobileStore = defineStore('IsOnMobile', () => {
  const isOnMobile = ref()
  return { isOnMobile }
})

// Initialize the stores
const mockIsOnMobileStore = mockUseIsOnMobileStore()

/***********/
/* 2.Build */
/***********/

// Component Factory (Neutral environment state)
const mountSiteHeader = () => {
  return mount(SiteHeader, {
    global: {
      plugins: [mockPinia],
      stubs: {
        SiteNav: true,
        RouterLink: RouterLinkStub,
      },
    },
  })
}

/**********/
/* 3.Test */
/**********/

// WARNING : The component has 2 states regarding the environment state. Mobile or desktop. There is none used by default.

describe('SiteHeader.vue', () => {
  let wrapper

  beforeEach(() => {
    // Component mounting (Neutral environment state)
    wrapper = mountSiteHeader()
  })

  afterEach(() => {
    // Reset the store(s) state(s) to default to ensure a clean environment for each test
    mockIsOnMobileStore.isOnMobile = undefined
  })

  // Smoke Tests
  test('mounts successfully', async () => {
    /********************************************************************/
    /* Assert the component is well mounted for the mobile environment */
    /********************************************************************/

    // Set environment to mobile
    mockIsOnMobileStore.isOnMobile = true
    await nextTick()

    // Assert the wrapper component is well mounted
    expect(wrapper.exists()).toBeTruthy()

    /*********************************************************************/
    /* Assert the component is well mounted for the desktop environment */
    /*********************************************************************/

    // Set environment to desktop
    mockIsOnMobileStore.isOnMobile = false
    await nextTick()

    // Assert the wrapper component is well mounted
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('For both states', () => {
    test('Site logo is rendered with necessary information for both environment', () => {
      // Assert the site logo component is rendered
      const SiteLogoComponent = wrapper.findComponent(SiteLogo)
      expect(SiteLogoComponent.exists()).toBeTruthy()

      // Find the site logo link
      const link = wrapper
        .findAllComponents(RouterLinkStub)
        .find((link) => link.attributes('data-testid') === 'site-header__logo-link')

      // Assert the site logo has a link
      expect(link.exists()).toBeTruthy()

      // Assert the link has the correct url
      expect(link.props('to')).toBe('/')
    })

    test('Cart link is rendered with necessary information for both environment', () => {
      // Find the link
      const link = wrapper
        .findAllComponents(RouterLinkStub)
        .find((link) => link.attributes('data-testid') === 'site-header__cart-link')

      // Assert the link is rendered
      expect(link.exists()).toBeTruthy()

      // Assert the link has the correct url
      expect(link.props('to')).toBe('/cart')

      // Assert the link icon is rendered
      const icon = link.find("[data-testid='icon-cart']")
      expect(icon.exists()).toBeTruthy()

      // Assert the alternative text is rendered
      const alternativeText = link.find("[data-testid='site-header__icon-text']")
      expect(alternativeText.text()).toContain('Cart')

      // Assert the link has NOT been improperly modified
      expect(link.html()).toMatchInlineSnapshot(`
        "<a data-v-a8a65ae7="" title="Go to cart" data-testid="site-header__cart-link">
          <div data-v-e69856ec="" data-v-a8a65ae7="" class="site-header__icon-clickable-area"><svg data-v-a8a65ae7="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" data-testid="icon-cart" class="site-header__icon" width="27" aria-hidden="true">
              <path fill-rule="evenodd" d="M2.5 3.75a.75.75 0 0 1 .75-.75h1.612a1.75 1.75 0 0 1 1.732 1.5h9.656a.75.75 0 0 1 .748.808l-.358 4.653a2.75 2.75 0 0 1-2.742 2.539h-6.351l.093.78a.25.25 0 0 0 .248.22h6.362a.75.75 0 0 1 0 1.5h-6.362a1.75 1.75 0 0 1-1.738-1.543l-1.04-8.737a.25.25 0 0 0-.248-.22h-1.612a.75.75 0 0 1-.75-.75Zm4.868 7.25h6.53a1.25 1.25 0 0 0 1.246-1.154l.296-3.846h-8.667l.595 5Z"></path>
              <path d="M10 17a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path>
              <path d="M15 17a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path>
            </svg><span data-v-e69856ec="" class="site-header__icon-text sr-only" data-testid="site-header__icon-text">Cart</span></div>
        </a>"
      `)
    })
  })

  describe('Mobile environment state', () => {
    beforeEach(async () => {
      // Set the environment to mobile
      mockIsOnMobileStore.isOnMobile = true
      await nextTick()
    })

    test('Burger menu toggle button is rendered', () => {
      const BurgerMenuToggleComponent = wrapper.findComponent(BurgerMenuToggle)
      expect(BurgerMenuToggleComponent.exists()).toBeTruthy()
    })

    test('Site navigation is NOT rendered', async () => {
      const SiteNavComponent = wrapper.findComponent(SiteNav)
      expect(SiteNavComponent.exists()).toBeFalsy()
    })

    test('My account link is rendered with necessary information', () => {
      // Find the link
      const link = wrapper
        .findAllComponents(RouterLinkStub)
        .find((link) => link.attributes('data-testid') === 'site-header__account-link')

      // Assert the link is rendered
      expect(link.exists()).toBeTruthy()

      // Assert the link has the correct url
      expect(link.props('to')).toBe('/account')

      // Assert the link icon is rendered
      const icon = link.find("[data-testid='icon-person']")
      expect(icon.exists()).toBeTruthy()

      // Assert the alternativeText is rendered
      const alternativeText = link.find("[data-testid='site-header__icon-text']")
      expect(alternativeText.html()).toContain('Account')

      // Assert the link has NOT been improperly modified
      expect(link.html()).toMatchInlineSnapshot(`
        "<a data-v-a8a65ae7="" title="Go to my account" data-testid="site-header__account-link">
          <div data-v-e69856ec="" data-v-a8a65ae7="" class="site-header__icon-clickable-area"><svg data-v-a8a65ae7="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" data-testid="icon-person" class="site-header__icon" width="27" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 3a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-2 3.5a2 2 0 1 1 4 0 2 2 0 0 1-4 0Z"></path>
              <path fill-rule="evenodd" d="M15.484 14.227a6.274 6.274 0 0 0-10.968 0l-.437.786a1.338 1.338 0 0 0 1.17 1.987h9.502a1.338 1.338 0 0 0 1.17-1.987l-.437-.786Zm-9.657.728a4.773 4.773 0 0 1 8.346 0l.302.545h-8.95l.302-.545Z"></path>
            </svg><span data-v-e69856ec="" class="site-header__icon-text sr-only" data-testid="site-header__icon-text">Account</span></div>
        </a>"
      `)
    })
  })

  describe('Desktop environment state', () => {
    beforeEach(async () => {
      // Reset the environment to desktop
      mockIsOnMobileStore.isOnMobile = false

      // Wait after the SiteNav async import has been fulfilled
      await flushPromises()
    })

    test('Burger menu toggle button is NOT rendered', async () => {
      const BurgerMenuToggleComponent = wrapper.findComponent(BurgerMenuToggle)
      expect(BurgerMenuToggleComponent.exists()).toBeFalsy()
    })

    test('Site navigation is rendered on desktop', async () => {
      const SiteNavComponent = wrapper.findComponent(SiteNav)
      expect(SiteNavComponent.exists()).toBeTruthy()
    })

    test('My account link is NOT rendered', async () => {
      // Assert the link is NOT rendered on desktop
      const link = wrapper.find("[data-testid='site-header__account-link']")
      expect(link.exists()).toBeFalsy()
    })
  })
})
