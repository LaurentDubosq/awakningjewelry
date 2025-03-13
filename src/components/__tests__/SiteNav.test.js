import { mount, RouterLinkStub } from '@vue/test-utils'
import SiteNav from '@/components/SiteNav.vue'
import SiteNavLink from '@/components/SiteNavLink.vue'
import SiteNavDropdown from '@/components/SiteNavDropdown.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import frontDataBase from '../../../db.json'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { createTestingPinia } from '@pinia/testing'

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
const pinia = createTestingPinia()

// Create the store
const useSiteMenuStore = defineStore('SiteMenu', () => {
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
const siteMenuStore = useSiteMenuStore()

/***********/
/* 2.Build */
/***********/

// Component Factory
function mountSiteNav() {
  return mount(SiteNav, {
    global: {
      plugins: [pinia],
      stubs: { RouterLink: RouterLinkStub },
    },
  })
}

/**********/
/* 3.Test */
/**********/

describe('SiteNav.vue', () => {
  let wrapper

  beforeEach(() => {
    siteMenuStore.siteMenu = { ...siteMenuStore.siteMenu, status: 'resolved' } // reset the data fetching status to resolved
    wrapper = mountSiteNav()
  })

  // Smoke test
  test('mounts successfully', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  test('renders all the expected navigation items with necessary information', () => {
    // Assert that all the expected navigation items are rendered
    const items = wrapper.findAll("[data-testid='site-nav__item']")
    expect(items).toHaveLength(mockSiteMenuDataLength)

    // Assert that each item is rendered with its necessary information
    items.forEach(async (item, index) => {
      // Utilities
      function isTextLink() {
        return item.find("[data-testid='site-nav__link--text']").exists()
      }
      function isIconLink() {
        return item.find("[data-testid='site-nav__link--icon']").exists()
      }
      function isDropdown() {
        return item.findComponent(SiteNavDropdown).exists()
      }

      if (isTextLink()) {
        const SiteNavLinkComponent = item.findComponent(SiteNavLink)
        const link = item.findComponent(RouterLinkStub)
        const mockLink = mockSiteMenuData[index]
        const mockLinkText = mockLink.text
        const mockLinkURL = mockLink.url

        // Assert the SiteNavLink component is rendered
        expect(SiteNavLinkComponent.exists()).toBeTruthy()

        // Assert the component "link" prop has the correct value
        expect(SiteNavLinkComponent.props('link')).toMatchObject(mockLink)

        /*******************/
        /* SiteNavLink.vue */
        /*******************/

        // Assert the link exists
        expect(link.exists()).toBeTruthy()

        // Assert the link has the correct url
        expect(link.props('to')).toBe(mockLinkURL)

        // Assert the link's text is rendered
        expect(link.text()).toContain(mockLinkText)
      } else if (isIconLink()) {
        const SiteNavLinkComponent = item.findComponent(SiteNavLink)
        const link = item.findComponent(RouterLinkStub)
        const linkAlternativeText = item.find("[data-testid='site-header__icon-text']")
        const linkSVG = item.find('svg')
        const mockLink = mockSiteMenuData[index]
        const mockLinkText = mockLink.text
        const mockLinkURL = mockLink.url

        // Assert the SiteNavLink component is rendered
        expect(SiteNavLinkComponent.exists()).toBeTruthy()

        // Assert the component "link" prop has the correct value
        expect(SiteNavLinkComponent.props('link')).toMatchObject(mockLink)

        /*******************/
        /* SiteNavLink.vue */
        /*******************/

        // Assert the link exists
        expect(link.exists()).toBeTruthy()

        // Assert the link has the correct url
        expect(link.props('to')).toBe(mockLinkURL)

        // Assert the link icon is rendered
        expect(linkSVG.exists()).toBeTruthy()

        // Assert the alternative link text is rendered (for screen readers and search engine robots)
        expect(linkAlternativeText.text()).toContain(mockLinkText)
      } else if (isDropdown()) {
        const SiteNavDropdownComponent = item.findComponent(SiteNavDropdown)
        const dropdown = item.find("[data-testid='site-nav__dropdown']")
        const dropdownButton = item.find("[data-testid='site-nav__dropdown-button']")
        const mockDropdown = mockSiteMenuData[index]
        const mockDropdownTitle = mockDropdown.text
        const mockDropdownList = mockDropdown.subMenu
        const mockDropdownListLength = mockDropdownList.length

        // Assert the SiteNavDropdown component is rendered
        expect(SiteNavDropdownComponent.exists()).toBeTruthy()

        // Assert the component "dropdown" prop has the correct value
        expect(SiteNavDropdownComponent.props('dropdown')).toMatchObject(mockDropdown)

        /*****************************/
        /* SiteNavDropdownButton.vue */
        /*****************************/

        // Assert the dropdown button text is rendered
        expect(dropdownButton.text()).toContain(mockDropdownTitle)

        /***************************/
        /* SiteNavDropdownList.vue */
        /***************************/

        // Open the dropdown
        await dropdown.trigger('mouseenter')

        // Assert all the expected links are rendered
        const dropdownItems = item.findAll("[data-testid='site-nav__dropdown-item']")
        expect(dropdownItems).toHaveLength(mockDropdownListLength)

        /***************************/
        /* SiteNavDropdownItem.vue */
        /***************************/

        // Assert each link is rendered with its necessary information
        dropdownItems.forEach((item, index) => {
          const link = item.findComponent(RouterLinkStub)
          const mockLink = mockDropdownList[index]
          const mockLinkText = mockLink.text
          const mockLinkURL = mockLink.url

          // Assert the link has the correct url
          expect(link.props('to')).toBe(mockLinkURL)

          // Assert the link's text is rendered
          expect(link.text()).toContain(mockLinkText)
        })
      }
    })
  })

  describe('Behaviors:', () => {
    test("when the data fetcher status is 'pending', the loading component is rendered", () => {
      // Set the data fetching status to pending
      siteMenuStore.siteMenu = { ...siteMenuStore.siteMenu, status: 'pending' } // reset the data fetching status to pending

      // Remount the component with pending status active
      wrapper = mountSiteNav('pending')

      // Assert the loading component is rendered
      const loadingComponent = wrapper.findComponent(LoadingComponent)
      expect(loadingComponent.exists()).toBeTruthy()
    })

    test("when the data fetcher status is 'resolved', its data is rendered", () => {
      // Assert that one of its pieces of data is rendered
      const firstItem = wrapper.find("[data-testid='site-nav__item']")
      expect(firstItem.exists()).toBeTruthy()
    })

    test("when the data fetcher status is 'rejected', the error component is rendered", () => {
      // Set the data fetching status to rejected
      siteMenuStore.siteMenu = { ...siteMenuStore.siteMenu, status: 'rejected' } // reset the data fetching status to rejected

      // Remount the component with rejected status active
      wrapper = mountSiteNav('rejected')

      // Assert the error component is rendered
      const errorComponent = wrapper.findComponent(ErrorComponent)
      expect(errorComponent.exists()).toBeTruthy()
    })
  })
})
