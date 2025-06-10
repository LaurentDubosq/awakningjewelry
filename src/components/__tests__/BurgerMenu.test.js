import { mount } from '@vue/test-utils'
import BurgerMenu from '@/components/BurgerMenu.vue'
import BurgerMenuLink from '@/components/BurgerMenuLink.vue'
import BurgerMenuDropdown from '@/components/BurgerMenuDropdown.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import frontDataBase from '../../../db.json'
import { createTestingPinia } from '@pinia/testing'
import { defineStore } from 'pinia'
import { computed, ref, defineComponent, nextTick } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { afterEach, beforeEach } from 'vitest'

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
const mockPinia = createTestingPinia({ stubActions: false })

// Create the stores
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
const mockIsBurgerMenuOpenStore = mockUseIsBurgerMenuOpenStore()
const mockSiteMenuStore = mockUseSiteMenuStore()

/* Utilities */

function isLink(item) {
  return item.findComponent(BurgerMenuLink).exists()
}
function isDropdown(item) {
  return item.findComponent(BurgerMenuDropdown).exists()
}

/***********/
/* 2.Build */
/***********/

// Component Factory (Data fetching "Pending" state - Dropdown open state)
function mountBurgerMenu() {
  return mount(BurgerMenu, {
    attachTo: document.body,
    global: {
      plugins: [mockRouter, mockPinia],
    },
  })
}

/**********/
/* 3.Test */
/**********/

// WARNING : The component has 3 states regarding the store data fetching status. "Pending", "Rejected" and "Fulfilled". The state by default is "Pending".

// WARNING : The component has 2 states regarding its dropdown opening status. Open or close. The state by default is open.

describe('BurgerMenu.vue', () => {
  let wrapper

  beforeEach(() => {
    // Component mounting (Data fetching "Pending" state - Dropdown open state)
    wrapper = mountBurgerMenu()
  })

  afterEach(() => {
    // Reset the store(s) state(s) to default to ensure a clean environment for each test
    mockSiteMenuStore.siteMenuResult = mockSiteMenuPending
    mockUseIsBurgerMenuOpenStore.isBurgerMenuOpen = false
  })

  // Smoke test
  test('mounts successfully', async () => {
    // Assert the wrapper component is well mounted at initial render
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('Initial render - Data fetching "Pending" state', () => {
    test('the loader animation is rendered', async () => {
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

    test('renders all navigation items with necessary information', async () => {
      // Find the navigation items
      const items = wrapper.findAll("[data-testid='burger-menu__item']")

      // Assert all navigation items are rendered
      expect(items).toHaveLength(mockSiteMenuLength)

      // Assert each item is rendered with its necessary information
      for (let index = 0; index < items.length; index++) {
        if (isLink(items[index])) {
          const link = items[index].find("[data-testid='burger-menu__link']")
          const mockLink = mockSiteMenu[index]
          const mockLinkURL = mockLink.url
          const mockLinkText = mockLink.text

          // Assert the link exists
          expect(link.exists()).toBeTruthy()

          // Assert the link has the correct url
          expect(link.attributes('href')).toBe(mockLinkURL)

          // Assert the link text is rendered
          expect(link.text()).toContain(mockLinkText)
        } else if (isDropdown(items[index])) {
          const dropdown = items[index].find("[data-testid='burger-menu__dropdown']")
          const button = dropdown.find("[data-testid='burger-menu__dropdown-button']")
          let buttonIcon
          let links

          const mockDropdown = mockSiteMenu[index]
          const mockDropdownButtonText = mockDropdown.button.text
          const mockDropdownLinks = mockDropdown.links
          const mockDropdownLinksLength = mockDropdownLinks.length

          /* TOGGLE BUTTON */

          // Assert the button is rendered
          expect(button.exists()).toBeTruthy()

          // Assert the button text is rendered
          expect(button.text()).toContain(mockDropdownButtonText)

          // Assert the open/close icon state is ignored by assistive technologies
          const iconWrapper = button.find(
            "[data-testid='burger-menu__dropdown-button-icon-wrapper']",
          )
          expect(iconWrapper.attributes('aria-hidden')).toBe('true')

          /****************************************/
          /* Initial Render - Dropdown open state */
          /****************************************/

          /* TOGGLE BUTTON */

          // Assert the open icon is rendered
          buttonIcon = button.find("[data-testid='icon-sign-minus']")
          expect(buttonIcon.isVisible()).toBeTruthy()

          /* LINKS */

          // Find the links
          links = dropdown.findAll("[data-testid='burger-menu__dropdown-item-link']")

          // Assert all links are rendered
          expect(links).toHaveLength(mockDropdownLinksLength)

          // Assert each link is rendered with its necessary information
          links.forEach((link, index) => {
            const mockLink = mockDropdownLinks[index]
            const mockLinkURL = mockLink.url
            const mockLinkText = mockLink.text

            // Assert the link is rendered
            expect(link.isVisible()).toBeTruthy()

            // Assert the link has the correct url
            expect(link.attributes('href')).toBe(mockLinkURL)

            // Assert the link's text is well rendered
            expect(link.text()).toContain(mockLinkText)
          })

          /************************/
          /* Dropdown close state */
          /************************/

          // Close the dropdown
          await button.trigger('click')

          /* TOGGLE BUTTON */

          // Assert the close icon is rendered
          buttonIcon = button.find("[data-testid='icon-sign-plus']")
          expect(buttonIcon.isVisible()).toBeTruthy()

          // Reset(open) the dropdown for following assertions
          await button.trigger('click')
        }
      }
    })

    describe('Behaviors:', () => {
      test('each navigation item behaves like it should', async () => {
        // Find the navigation items
        const items = wrapper.findAll("[data-testid='burger-menu__item']")

        // Assert each navigation item behaves like is should
        for (let index = 0; index < items.length; index++) {
          if (isLink(items[index])) {
            let link

            /******************************************************************/
            /* when the link is touched, it commands the burger menu to close */
            /******************************************************************/

            // Set the burger menu status to open
            mockIsBurgerMenuOpenStore.isBurgerMenuOpen = true

            // Assert the burger menu status is open
            expect(mockIsBurgerMenuOpenStore.isBurgerMenuOpen).toBe(true)

            // Touch the link
            link = items[index].find("[data-testid='burger-menu__link']")
            await link.trigger('click')

            // Assert the burger menu status is close
            expect(mockIsBurgerMenuOpenStore.isBurgerMenuOpen).toBe(false)

            /************************************************************************************************/
            /* when the link is focused and we press the "escape key", it commands the burger menu to close */
            /************************************************************************************************/

            // Set the burger menu status to open
            mockIsBurgerMenuOpenStore.isBurgerMenuOpen = true

            // Focus the link
            link = items[index].find("[data-testid='burger-menu__link']")
            link.element.focus() // this method guarantee that the DOM element will be focused

            // Press the "escape" key
            await link.trigger('keydown.escape')

            // Assert the burger menu status is close
            expect(mockIsBurgerMenuOpenStore.isBurgerMenuOpen).toBe(false)
          } else if (isDropdown(items[index])) {
            const dropdown = items[index].find("[data-testid='burger-menu__dropdown']")
            let button
            let links
            let list

            /***********************************/
            /* the dropdown is open by default */
            /***********************************/

            // Assert the dropdown is open
            list = dropdown.find("[data-testid='burger-menu__dropdown-list']")
            expect(list.isVisible()).toBeTruthy()

            /****************************************************************************/
            /* when the dropdown toggle button is touched, it opens/closes the dropdown */
            /****************************************************************************/

            // Assert the dropdown is open
            list = dropdown.find("[data-testid='burger-menu__dropdown-list']")
            expect(list.isVisible()).toBeTruthy()

            // Touch the button
            button = dropdown.find("[data-testid='burger-menu__dropdown-button']")
            await button.trigger('click')

            // Assert the dropdown is close
            list = dropdown.find("[data-testid='burger-menu__dropdown-list']")
            expect(list.isVisible()).toBeFalsy()

            // Touch the button again
            button = dropdown.find("[data-testid='burger-menu__dropdown-button']")
            await button.trigger('click')

            // Assert the dropdown is open
            list = dropdown.find("[data-testid='burger-menu__dropdown-list']")
            expect(list.isVisible()).toBeTruthy()

            /******************************************************************************************************************/
            /* when the dropdown toggle button is focused and we press the "escape key", it commands the burger menu to close */
            /******************************************************************************************************************/

            // Set the burger menu status to open
            mockIsBurgerMenuOpenStore.isBurgerMenuOpen = true

            // Focus the button
            button = dropdown.find("[data-testid='burger-menu__dropdown-button']")
            button.element.focus() // this method guarantee that the DOM element will be focused

            // Press the "escape" key
            await button.trigger('keydown.escape')

            // Assert the burger menu status is close
            expect(mockIsBurgerMenuOpenStore.isBurgerMenuOpen).toBe(false)

            /****************************************************************************/
            /* when each dropdown link is touched, it commands the burger menu to close */
            /****************************************************************************/

            // Set the burger menu status to open
            mockIsBurgerMenuOpenStore.isBurgerMenuOpen = true

            // Find the links
            links = dropdown.findAll("[data-testid='burger-menu__dropdown-item-link']")

            for (let index = 0; index < links.length; index++) {
              // Set the burger menu status to open
              mockIsBurgerMenuOpenStore.isBurgerMenuOpen = true

              // Assert the burger menu status is open
              expect(mockIsBurgerMenuOpenStore.isBurgerMenuOpen).toBe(true)

              // Touch the link
              await links[index].trigger('click')

              // Assert the burger menu status is close
              expect(mockIsBurgerMenuOpenStore.isBurgerMenuOpen).toBe(false)
            }

            /**********************************************************************************************************/
            /* when each dropdown link is focused and we press the "escape key", it commands the burger menu to close */
            /**********************************************************************************************************/

            // Set the burger menu status to open
            mockIsBurgerMenuOpenStore.isBurgerMenuOpen = true

            // Find the links
            links = dropdown.findAll("[data-testid='burger-menu__dropdown-item-link']")

            for (let index = 0; index < links.length; index++) {
              // Set the burger menu status to open
              mockIsBurgerMenuOpenStore.isBurgerMenuOpen = true

              // Assert the burger menu status is open
              expect(mockIsBurgerMenuOpenStore.isBurgerMenuOpen).toBe(true)

              // Focus the link
              links[index].element.focus() // this method guarantee that the DOM element will be focused

              // Press the "escape" key
              await links[index].trigger('keydown.escape')

              // Assert the burger menu status is close
              expect(mockIsBurgerMenuOpenStore.isBurgerMenuOpen).toBe(false)
            }
          }
        }
      })
    })
  })
})
