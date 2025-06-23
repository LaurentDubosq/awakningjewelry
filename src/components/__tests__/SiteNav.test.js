import { mount } from '@vue/test-utils'
import SiteNav from '@/components/SiteNav.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import frontDataBase from '../../../db.json'
import { defineStore } from 'pinia'
import { computed, nextTick, ref, defineComponent } from 'vue'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'

/********************/
/* 1.Initialization */
/********************/

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
const mockSiteMenuRejected = {
  data: undefined,
  status: 'rejected',
}
const mockSiteMenuFulfilled = {
  data: frontDataBase.siteMenu,
  status: 'fulfilled',
}
const mockSiteMenu = mockSiteMenuFulfilled.data
const mockSiteMenuLength = mockSiteMenu.length

/* Stores */

// Initialize a testing pinia instance
const mockPinia = createTestingPinia()

// Create the store
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
const mockSiteMenuStore = mockUseSiteMenuStore()

/* Utilities */

function isTextLink(item) {
  return item.find("[data-testid='site-nav__link--text']").exists()
}
function isIconLink(item) {
  return item.find("[data-testid='site-nav__link--icon']").exists()
}
function isDropdown(item) {
  return item.find("[data-testid='site-nav__dropdown']").exists()
}

/***********/
/* 2.Build */
/***********/

// Component Factory (Data fetching "Pending" state - Dropdown open state)
function mountSiteNav() {
  return mount(SiteNav, {
    attachTo: document.body,
    global: {
      plugins: [mockRouter, mockPinia],
    },
  })
}

/**********/
/* 3.Test */
/**********/

// WARNING : The component has 3 states regarding the data fetching status. "Pending", "Rejected" and "Fulfilled". The state by default is "Pending".

// WARNING : The component has 2 states regarding its dropdown opening status. Open or close. The state by default is open.

describe('SiteNav.vue', () => {
  let wrapper

  beforeEach(() => {
    // Component mounting (Data fetching "Pending" state - Dropdown open state)
    wrapper = mountSiteNav()
  })

  afterEach(() => {
    // Reset the store(s) state(s) to default to ensure a clean environment for each test
    mockSiteMenuStore.siteMenuResult = mockSiteMenuPending
  })

  // Smoke test
  test('mounts successfully', async () => {
    // Assert the wrapper component is well mounted at initial render
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('Initial render - Data fetching "Pending" state', () => {
    test('the loader is rendered', async () => {
      // Assert the loading component is rendered
      const loadingComponent = wrapper.findComponent(LoadingComponent)
      expect(loadingComponent.exists()).toBeTruthy()
    })
  })

  describe('Data fetching "Rejected" state', () => {
    test('the error message is rendered', async () => {
      // Set the store data fetching status to rejected
      mockSiteMenuStore.siteMenuResult = mockSiteMenuRejected
      await nextTick()

      // Assert the error message is rendered
      const errorComponent = wrapper.findComponent(ErrorComponent)
      expect(errorComponent.exists()).toBeTruthy()
    })
  })

  describe('Data fetching "Fulfilled" state - Dropdown open state', async () => {
    beforeEach(async () => {
      // Set the store data fetching status to fulfilled
      mockSiteMenuStore.siteMenuResult = mockSiteMenuFulfilled
      await nextTick()
    })

    test('renders the feature accessibility label', () => {
      const nav = wrapper.find("[data-testid='site-nav']")
      expect(nav.attributes('aria-label')).toBe("Website's desktop navigation bar")
    })

    test('renders all navigation items with necessary information', async () => {
      // Find the navigation items
      const items = wrapper.findAll("[data-testid='site-nav__item']")

      // Assert all navigation items are rendered
      expect(items).toHaveLength(mockSiteMenuLength)

      // Assert each item is rendered with its necessary information
      for (let index = 0; index < items.length; index++) {
        if (isTextLink(items[index])) {
          const link = items[index].find("[data-testid='site-nav__link--text']")
          const mockLink = mockSiteMenu[index]
          const mockLinkText = mockLink.text
          const mockLinkURL = mockLink.url
          const mockLinkTitle = mockLink.title

          // Assert the link exists
          expect(link.exists()).toBeTruthy()

          // Assert the link has the correct url
          expect(link.attributes('href')).toBe(mockLinkURL)

          // Assert the link title is rendered
          expect(link.attributes('title')).toBe(mockLinkTitle)

          // Assert the link text is rendered
          expect(link.text()).toContain(mockLinkText)
        } else if (isIconLink(items[index])) {
          const link = items[index].find("[data-testid='site-nav__link--icon']")
          const icon = items[index].find("[data-testid='icon-person']")
          const alternativeText = items[index].find("[data-testid='site-header__icon-text']")
          const mockLink = mockSiteMenu[index]
          const mockLinkURL = mockLink.url
          const mockLinkTitle = mockLink.title
          const mockLinkAlternativeText = mockLink.text

          // Assert the link exists
          expect(link.exists()).toBeTruthy()

          // Assert the link has the correct url
          expect(link.attributes('href')).toBe(mockLinkURL)

          // Assert the link title has the correct value
          expect(link.attributes('title')).toBe(mockLinkTitle)

          // Assert the icon is rendered
          expect(icon.exists()).toBeTruthy()

          // Assert the alternative text is rendered
          expect(alternativeText.text()).toContain(mockLinkAlternativeText)
        } else if (isDropdown(items[index])) {
          const dropdown = items[index].find("[data-testid='site-nav__dropdown']")
          const button = items[index].find("[data-testid='site-nav__dropdown-button']")
          let list = dropdown.find("[data-testid='site-nav__dropdown-list']")

          const mockDropdown = mockSiteMenu[index]
          const mockDropdownButtonText = mockDropdown.button.text
          const mockDropdownButtonTitle = mockDropdown.button.title
          const mockDropdownLinks = mockDropdown.links

          /* TOGGLE BUTTON */

          // Assert the button is rendered
          expect(button.exists()).toBeTruthy()

          // Assert the button text is rendered
          expect(button.text()).toContain(mockDropdownButtonText)

          // Assert the button title is rendered
          expect(button.attributes('title')).toBe(mockDropdownButtonTitle)

          /*****************************************/
          /* Initial Render - Dropdown close state */
          /*****************************************/

          /* TOGGLE BUTTON */

          // Assert the close icon is rendered
          expect(button.text()).toContain('▼')

          /***********************/
          /* Dropdown open state */
          /***********************/

          // Open the dropdown
          await dropdown.trigger('mouseenter')

          /* TOGGLE BUTTON */

          // Assert the open icon is rendered
          expect(button.text()).toContain('▲')

          /* Links */

          // Open the dropdown
          await dropdown.trigger('mouseenter')

          // Find the links
          list = dropdown.find("[data-testid='site-nav__dropdown-list']")

          // Assert all links are rendered
          const links = list.findAll("[data-testid='site-nav__dropdown-item-link']")
          expect(links).toHaveLength(mockDropdownLinks.length)

          // Assert that each link is rendered with necessary information
          links.forEach((link, index) => {
            const mockLink = mockDropdownLinks[index]
            const mockLinkText = mockLink.text
            const mockLinkURL = mockLink.url

            // Assert the link is rendered
            expect(link.exists()).toBeTruthy()

            // Assert the link has the correct url
            expect(link.attributes('href')).toContain(mockLinkURL)

            // Assert the link text is well rendered
            expect(link.text()).toContain(mockLinkText)
          })

          // Reset(close) the dropdown for following assertions
          await dropdown.trigger('mouseleave')
        }
      }
    })

    describe('Behaviors:', () => {
      test('each navigation item behaves like it should', async () => {
        // Find the navigation items
        const items = wrapper.findAll("[data-testid='site-nav__item']")

        // Assert each navigation item behaves like is should
        for (let index = 0; index < items.length; index++) {
          if (isTextLink(items[index])) {
            continue // there is no behavior to test
          } else if (isIconLink(items[index])) {
            continue // there is no behavior to test
          } else if (isDropdown(items[index])) {
            const dropdown = items[index].find("[data-testid='site-nav__dropdown']")
            const button = dropdown.find("[data-testid='site-nav__dropdown-button']")
            let list = dropdown.find("[data-testid='site-nav__dropdown-list']")
            let links
            let firstLink

            /************************************/
            /* the dropdown is close by default */
            /************************************/

            // Assert the dropdown is close at initial render
            expect(list.exists()).toBeFalsy()

            /*********************************************************************/
            /* when the dropdown toggle button is focused, it opens the dropdown */
            /*********************************************************************/

            // Assert the dropdown is close
            list = dropdown.find("[data-testid='site-nav__dropdown-list']")
            expect(list.exists()).toBeFalsy()

            // Focus the button
            await button.trigger('focus')

            // Assert the dropdown is open
            list = dropdown.find("[data-testid='site-nav__dropdown-list']")
            expect(list.exists()).toBeTruthy()

            // Reset(close) the dropdown for following assertions
            await dropdown.trigger('mouseleave')

            /*******************************************************************************************/
            /* when the mouse enters and leaves the dropdown toggle button, it open/close the dropdown */
            /*******************************************************************************************/

            // Assert the dropdown is close
            list = dropdown.find("[data-testid='site-nav__dropdown-list']")
            expect(list.exists()).toBeFalsy()

            // Mouse enters the dropdown
            await dropdown.trigger('mouseenter')

            // Assert the dropdown is open
            list = dropdown.find("[data-testid='site-nav__dropdown-list']")
            expect(list.exists()).toBeTruthy()

            // Mouse leaves the dropdown
            await dropdown.trigger('mouseleave')

            // Assert the dropdown is close
            list = dropdown.find("[data-testid='site-nav__dropdown-list']")
            expect(list.exists()).toBeFalsy()

            /*************************************************************/
            /* when each dropdown link is clicked, it close the dropdown */
            /*************************************************************/

            // Assert the dropdown is close
            list = dropdown.find("[data-testid='site-nav__dropdown-list']")
            expect(list.exists()).toBeFalsy()

            // Open the dropdown
            await dropdown.trigger('mouseenter')

            // Assert the dropdown is open
            list = dropdown.find("[data-testid='site-nav__dropdown-list']")
            expect(list.exists()).toBeTruthy()

            // Finds the links
            list = dropdown.find("[data-testid='site-nav__dropdown-list']")
            links = list.findAll("[data-testid='site-nav__dropdown-item-link']")

            // Assert each dropdown link close the dropdown
            for (let index = 0; index < links.length; index++) {
              // Assert the dropdown is open
              list = dropdown.find("[data-testid='site-nav__dropdown-list']")
              expect(list.exists()).toBeTruthy()

              // Click on the link
              await links[index].trigger('click')

              // Assert the dropdown is close
              list = dropdown.find("[data-testid='site-nav__dropdown-list']")
              expect(list.exists()).toBeFalsy()

              // Reset the dropdown to open for next loop iterations
              await dropdown.trigger('mouseenter')
            }

            // Close the dropdown for following assertions
            await dropdown.trigger('mouseleave')

            /**********************************************************************************************************/
            /* when the focus is on the last dropdown link and then moves to an external element, the dropdown closes */
            /**********************************************************************************************************/

            // Assert the dropdown is close
            list = dropdown.find("[data-testid='site-nav__dropdown-list']")
            expect(list.exists()).toBeFalsy()

            // Open the dropdown
            await button.trigger('focus')

            // Assert the dropdown is open
            list = dropdown.find("[data-testid='site-nav__dropdown-list']")
            expect(list.exists()).toBeTruthy()

            // Focus the last link
            list = dropdown.find("[data-testid='site-nav__dropdown-list']")
            links = list.findAll("[data-testid='site-nav__dropdown-item-link']")
            links[links.length - 1].element.focus()

            // Focusout the last link element to focus on external element
            await dropdown.trigger('focusout', {
              relatedTarget: document.body,
            })

            // Assert the dropdown is close
            list = dropdown.find("[data-testid='site-nav__dropdown-list']")
            expect(list.exists()).toBeFalsy()

            /**************************************************************************************************************/
            /* when navigating through the dropdown using the keyboard and pressing the "Escape" key, the dropdown closes */
            /**************************************************************************************************************/

            // Assert the dropdown is close
            list = dropdown.find("[data-testid='site-nav__dropdown-list']")
            expect(list.exists()).toBeFalsy()

            // Open the dropdown
            await button.trigger('focus')

            // Assert the dropdown is open
            list = dropdown.find("[data-testid='site-nav__dropdown-list']")
            expect(list.exists()).toBeTruthy()

            // Focus the first link
            list = dropdown.find("[data-testid='site-nav__dropdown-list']")
            firstLink = list.find("[data-testid='site-nav__dropdown-item-link']")
            firstLink.element.focus()

            // Press the "Escape" key
            await firstLink.trigger('keydown.escape')

            // Assert the dropdown is close
            list = wrapper.find("[data-testid='site-nav__dropdown-list']")
            expect(list.exists()).toBeFalsy()
          }
        }
      })
    })
  })
})
