import { mount, RouterLinkStub } from '@vue/test-utils'
import BurgerMenu from '@/components/BurgerMenu.vue'
import BurgerMenuLink from '@/components/BurgerMenuLink.vue'
import BurgerMenuDropdown from '@/components/BurgerMenuDropdown.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import frontDataBase from '../../../db.json'
import { createTestingPinia } from '@pinia/testing'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

/********************/
/* 1.Initialization */
/********************/

/* Data */

const mockSiteMenuResult = {
  data: frontDataBase.siteMenu,
  status: 'resolved',
}
const mockSiteMenuData = mockSiteMenuResult.data
const mockSiteMenuDataLength = mockSiteMenuData.length

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
  const siteMenu = ref(mockSiteMenuResult)
  const siteMenuData = computed(() => siteMenu.value.data)
  const siteMenuResultFetchStatus = computed(() => siteMenu.value.status)
  return {
    siteMenu,
    siteMenuData,
    siteMenuResultFetchStatus,
  }
})

// Initialize the stores
mockUseIsBurgerMenuOpenStore()
const mockSiteMenuStore = mockUseSiteMenuStore()

/***********/
/* 2.Build */
/***********/

// Component Factory
function mountBurgerMenu() {
  return mount(BurgerMenu, {
    global: {
      plugins: [mockPinia],
      stubs: {
        RouterLink: RouterLinkStub,
      },
    },
  })
}

/**********/
/* 3.Test */
/**********/

describe('BurgerMenu.vue', () => {
  let wrapper

  beforeEach(() => {
    mockSiteMenuStore.siteMenu = { ...mockSiteMenuStore.siteMenu, status: 'resolved' } // reset the data fetching status to resolved
    wrapper = mountBurgerMenu()
  })

  // Smoke test
  test('mounts successfully', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  test('renders all the expected navigation items with necessary information', () => {
    // Assert that all the expected navigation items are rendered
    const items = wrapper.findAll("[data-testid='burger-menu__item']")
    expect(items).toHaveLength(mockSiteMenuDataLength)

    // Assert that each item is rendered with its necessary information
    items.forEach((item, index) => {
      // Utilities
      function isLink() {
        return item.findComponent(BurgerMenuLink).exists()
      }
      function isDropdown() {
        return item.findComponent(BurgerMenuDropdown).exists()
      }

      if (isLink()) {
        const BurgerMenuLinkComponent = item.findComponent(BurgerMenuLink)
        const link = BurgerMenuLinkComponent.findComponent(RouterLinkStub)
        const mockLink = mockSiteMenuData[index]
        const mockLinkURL = mockLink.url
        const mockLinkText = mockLink.text

        // Assert the BurgerMenuLink component is rendered
        expect(BurgerMenuLinkComponent.exists()).toBeTruthy()

        // Assert the component "link" prop has the correct value
        expect(BurgerMenuLinkComponent.props('link')).toMatchObject(mockLink)

        /**********************/
        /* BurgerMenuLink.vue */
        /**********************/

        // Assert the link has the correct url
        expect(link.props('to')).toBe(mockLinkURL)

        // Assert the link text is rendered
        expect(link.text()).toContain(mockLinkText)
      } else if (isDropdown()) {
        const BurgerMenuDropdownComponent = item.findComponent(BurgerMenuDropdown)
        const button = item.find("[data-testid='burger-menu__dropdown-button']")
        const items = item.findAll("[data-testid='burger-menu__dropdown-item']")
        const mockDropdown = mockSiteMenuData[index]
        const mockDropdownText = mockDropdown.text
        const mockDropdownItems = mockDropdown.subMenu
        const mockDropdownItemsLength = mockDropdownItems.length

        // Assert the BurgerMenuDropdown component is rendered
        expect(BurgerMenuDropdownComponent.exists()).toBeTruthy()

        // Assert the component "dropdown" prop has the correct value
        expect(BurgerMenuDropdownComponent.props('dropdown')).toMatchObject(mockDropdown)

        /********************************/
        /* BurgerMenuDropdownButton.vue */
        /********************************/

        // Assert the dropdown button text is rendered
        expect(button.text()).toContain(mockDropdownText)

        /******************************/
        /* BurgerMenuDropdownList.vue */
        /******************************/

        // Assert all the dropdown links are rendered
        expect(items).toHaveLength(mockDropdownItemsLength)

        /******************************/
        /* BurgerMenuDropdownItem.vue */
        /******************************/

        // Assert each link is rendered with its necessary information
        items.forEach((item, index) => {
          const link = item.findComponent(RouterLinkStub)
          const mockLink = mockDropdownItems[index]
          const mockLinkURL = mockLink.url
          const mockLinkText = mockLink.text

          // Assert the link has the correct url
          expect(link.props('to')).toBe(mockLinkURL)

          // Assert the link text is rendered
          expect(link.text()).toContain(mockLinkText)
        })
      }
    })
  })

  describe('Behaviors:', () => {
    test('when a burger menu link is focus and the escape key is pressed, it commands the burger menu to close', async () => {
      // Focus a burger menu link
      const link = wrapper.findComponent(RouterLinkStub)
      await link.trigger('focus')

      // Press the escape key
      await link.trigger('keydown.escape')

      // Assert the order to close the burger menu has been emitted
      expect(wrapper.emitted('close-burger-menu')).toHaveLength(1)
    })

    test("when the data fetcher status is 'pending', the loading component is rendered", () => {
      // Set the data fetching status to pending
      mockSiteMenuStore.siteMenu = { ...mockSiteMenuStore.siteMenu, status: 'pending' } // reset the data fetching status to pending

      // Remount the component with pending status active
      wrapper = mountBurgerMenu()

      // Assert the loading component is rendered
      const loadingComponent = wrapper.findComponent(LoadingComponent)
      expect(loadingComponent.exists()).toBeTruthy()
    })

    test("when the data fetcher status is 'resolved', its data is rendered", () => {
      // Assert that one of its pieces of data is rendered
      const firstItem = wrapper.find("[data-testid='burger-menu__item']")
      expect(firstItem.exists()).toBeTruthy()
    })

    test("when the data fetcher status is 'rejected', the error component is rendered", () => {
      // Set the data fetching status to rejected
      mockSiteMenuStore.siteMenu = { ...mockSiteMenuStore.siteMenu, status: 'rejected' } // reset the data fetching status to rejected

      // Remount the component with rejected status active
      wrapper = mountBurgerMenu()

      // Assert the error component is rendered
      const errorComponent = wrapper.findComponent(ErrorComponent)
      expect(errorComponent.exists()).toBeTruthy()
    })
  })
})
