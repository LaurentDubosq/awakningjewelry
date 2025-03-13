import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import SiteHeader from '@/components/SiteHeader.vue'
import BurgerMenuToggle from '@/components/BurgerMenuToggle.vue'
import SiteLogo from '@/components/SiteLogo.vue'
import SiteNav from '@/components/SiteNav.vue'
import SiteHeaderIcon from '@/components/SiteHeaderIcon.vue'
import { createTestingPinia } from '@pinia/testing'
import { defineStore } from 'pinia'
import { ref } from 'vue'

/********************/
/* 1.Initialization */
/********************/

// Initialize a testing pinia instance
const mockPinia = createTestingPinia()

// Create the stores
const mockUseIsOnMobileStore = defineStore('IsOnMobile', () => {
  const isOnMobile = ref(true)
  return { isOnMobile }
})

// Initialize the stores
const mockIsOnMobileStore = mockUseIsOnMobileStore()

/***********/
/* 2.Build */
/***********/

// Component Factory
function mountSiteHeader() {
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

describe('SiteHeader.vue', () => {
  let wrapper

  beforeEach(() => {
    mockIsOnMobileStore.isOnMobile = true // reset the environment to mobile
  })

  // Smoke Tests
  test('mounts successfully', () => {
    // Assert the testing environement is ready for mobile initial render
    wrapper = mountSiteHeader()
    expect(wrapper.exists()).toBeTruthy()

    // Assert the testing environement is ready for desktop initial render
    mockIsOnMobileStore.isOnMobile = false // set environment to desktop
    wrapper = mountSiteHeader()
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('BurgerMenuToggle.vue', () => {
    test('is rendered on mobile', () => {
      wrapper = mountSiteHeader()
      const BurgerMenuToggleComponent = wrapper.findComponent(BurgerMenuToggle)
      expect(BurgerMenuToggleComponent.exists()).toBeTruthy()
    })

    // Because the burger menu toggle is critical we also check that the component is not rendered on desktop
    test('is not rendered on desktop', () => {
      mockIsOnMobileStore.isOnMobile = false // set environment to desktop
      wrapper = mountSiteHeader()
      const BurgerMenuToggleComponent = wrapper.findComponent(BurgerMenuToggle)
      expect(BurgerMenuToggleComponent.exists()).toBeFalsy()
    })
  })

  describe('SiteLogo', () => {
    test('is rendered with necessary information', () => {
      wrapper = mountSiteHeader()
      const SiteLogoComponent = wrapper.findComponent(SiteLogo)
      const link = wrapper
        .findAllComponents(RouterLinkStub)
        .find((link) => link.attributes('data-testid') === 'site-header__logo-link')

      // Assert the site logo component is rendered
      expect(SiteLogoComponent.exists()).toBeTruthy()

      // Assert the site logo has a link
      expect(link.exists()).toBeTruthy()

      // Assert the link has the correct url
      expect(link.props('to')).toBe('/')
    })
  })

  describe('SiteNav.vue', () => {
    test('is rendered on desktop', async () => {
      mockIsOnMobileStore.isOnMobile = false // set environment to desktop
      wrapper = mountSiteHeader()

      // Wait after the SiteNav async import has been resolved after the component mounting
      await flushPromises()

      // Assert the component is rendered
      const SiteNavComponent = wrapper.findComponent(SiteNav)
      expect(SiteNavComponent.exists()).toBeTruthy()
    })

    // Because the site nav is critical we also check that the component is not rendered on mobile
    test('is not rendered on mobile', async () => {
      wrapper = mountSiteHeader()

      // Wait after the SiteNav async import has been resolved after the component mounting
      await flushPromises()

      // Assert the component is not rendered
      const SiteNavComponent = wrapper.findComponent(SiteNav)
      expect(SiteNavComponent.exists()).toBeFalsy()
    })
  })

  describe('My account link', () => {
    test('is rendered on mobile with necessary information', () => {
      wrapper = mountSiteHeader()
      const link = wrapper
        .findAllComponents(RouterLinkStub)
        .find((link) => link.attributes('data-testid') === 'site-header__account-link')
      const SiteHeaderIconComponent = link.findComponent(SiteHeaderIcon)
      const icon = link.find("[data-testid='icon-person']") // we target the icon instead of component because we decided to not have tests for SVG components

      // Assert the link is rendered
      expect(link.exists()).toBeTruthy()

      // Assert the link has the correct url
      expect(link.props('to')).toBe('/account')

      // Assert the SiteHeaderIcon component is rendered
      expect(SiteHeaderIconComponent.exists()).toBeTruthy()

      // Assert the "alternativeText" prop of the component has the correct value
      expect(SiteHeaderIconComponent.props('alternativeText')).toBe('Account')

      /**********************/
      /* SiteHeaderIcon.vue */
      /**********************/

      // Assert the link icon is rendered
      expect(icon.exists()).toBeTruthy()

      // Assert the alternative text is rendered (for screen readers and search engine robots)
      expect(link.text()).toContain('Account')

      // Assert the link has not been improperly modified
      expect(link.html()).toMatchInlineSnapshot(`
        "<a data-v-a8a65ae7="" title="Go to my account" data-testid="site-header__account-link">
          <div data-v-e69856ec="" data-v-a8a65ae7="" class="site-header__icon-clickable-area"><svg data-v-a8a65ae7="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" data-testid="icon-person" width="27" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 3a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-2 3.5a2 2 0 1 1 4 0 2 2 0 0 1-4 0Z"></path>
              <path fill-rule="evenodd" d="M15.484 14.227a6.274 6.274 0 0 0-10.968 0l-.437.786a1.338 1.338 0 0 0 1.17 1.987h9.502a1.338 1.338 0 0 0 1.17-1.987l-.437-.786Zm-9.657.728a4.773 4.773 0 0 1 8.346 0l.302.545h-8.95l.302-.545Z"></path>
            </svg><span data-v-e69856ec="" class="site-header__icon-text sr-only" data-testid="site-header__icon-text">Account</span></div>
        </a>"
      `)
    })

    // Because the account link is critical we also check that the component is not rendered on desktop
    test('is not rendered on desktop', () => {
      mockIsOnMobileStore.isOnMobile = false // set environment to desktop
      wrapper = mountSiteHeader()
      const link = wrapper.find("[data-testid='site-header__account-link']")
      expect(link.exists()).toBeFalsy()
    })
  })

  describe('Cart link', () => {
    test('is rendered with necessary information', () => {
      wrapper = mountSiteHeader()
      const link = wrapper
        .findAllComponents(RouterLinkStub)
        .find((link) => link.attributes('data-testid') === 'site-header__cart-link')
      const SiteHeaderIconComponent = link.findComponent(SiteHeaderIcon)
      const icon = link.find("[data-testid='icon-cart']") // we target the icon instead of component because we decided to not have tests for SVG components

      // Assert the link is rendered
      expect(link.exists()).toBeTruthy()

      // Assert the link has the correct url
      expect(link.props('to')).toBe('/cart')

      // Assert the SiteHeaderIcon component is rendered
      expect(SiteHeaderIconComponent.exists()).toBeTruthy()

      // Assert the "alternativeText" prop of the component has the correct value
      expect(SiteHeaderIconComponent.props('alternativeText')).toBe('Cart')

      /**********************/
      /* SiteHeaderIcon.vue */
      /**********************/

      // Assert the link icon is rendered
      expect(icon.exists()).toBeTruthy()

      // Assert the alternative text is rendered (for screen readers and search engine robots)
      expect(link.text()).toContain('Cart')

      // Assert that the link has not been improperly modified
      expect(link.html()).toMatchInlineSnapshot(`
        "<a data-v-a8a65ae7="" title="Go to cart" data-testid="site-header__cart-link">
          <div data-v-e69856ec="" data-v-a8a65ae7="" class="site-header__icon-clickable-area"><svg data-v-a8a65ae7="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" data-testid="icon-cart" width="27" aria-hidden="true">
              <path fill-rule="evenodd" d="M2.5 3.75a.75.75 0 0 1 .75-.75h1.612a1.75 1.75 0 0 1 1.732 1.5h9.656a.75.75 0 0 1 .748.808l-.358 4.653a2.75 2.75 0 0 1-2.742 2.539h-6.351l.093.78a.25.25 0 0 0 .248.22h6.362a.75.75 0 0 1 0 1.5h-6.362a1.75 1.75 0 0 1-1.738-1.543l-1.04-8.737a.25.25 0 0 0-.248-.22h-1.612a.75.75 0 0 1-.75-.75Zm4.868 7.25h6.53a1.25 1.25 0 0 0 1.246-1.154l.296-3.846h-8.667l.595 5Z"></path>
              <path d="M10 17a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path>
              <path d="M15 17a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path>
            </svg><span data-v-e69856ec="" class="site-header__icon-text sr-only" data-testid="site-header__icon-text">Cart</span></div>
        </a>"
      `)
    })
  })
})
