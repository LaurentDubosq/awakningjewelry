import { mount, RouterLinkStub } from '@vue/test-utils'
import BurgerMenuDropdown from '@/components/BurgerMenuDropdown.vue'
import frontDataBase from '../../../db.json'
import { createTestingPinia } from '@pinia/testing'
import { defineStore } from 'pinia'
import { ref } from 'vue'

/********************/
/* 1.Initialization */
/********************/

/* Data */

const mockDropdown = frontDataBase.siteMenu[1]
const mockDropdownButtonText = mockDropdown.button.text
const mockDropdownLinks = mockDropdown.links
const mockDropdownLinksLength = mockDropdownLinks.length

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

// Initialize the stores
const mockIsBurgerMenuOpenStore = mockUseIsBurgerMenuOpenStore()

/***********/
/* 2.Build */
/***********/

// Component Factory (Dropdown open state)
const mountBurgerMenuDropdown = () => {
  return mount(BurgerMenuDropdown, {
    attachTo: document.body,
    props: { dropdown: mockDropdown },
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

// WARNING : The component has 2 states regarding its dropdown opening state. Open or close. The state by default is open.

describe('BurgerMenuDropdown.vue', () => {
  let wrapper

  beforeEach(() => {
    // Component mounting (Dropdown open state)
    wrapper = mountBurgerMenuDropdown()
  })

  afterEach(() => {
    // Reset the store(s) state(s) to default to ensure a clean environment for each test
    mockIsBurgerMenuOpenStore.isBurgerMenuOpen = false
  })

  // Smoke test
  test('mounts successfully', async () => {
    // Assert the wrapper component is well mounted at initial render
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('Initial render - Dropdown open state', () => {
    test('renders the dropdown toggle button with necessary information', async () => {
      // Find the button
      const button = wrapper.find("[data-testid='burger-menu__dropdown-button']")

      // Assert the button is rendered
      expect(button.exists()).toBeTruthy()

      // Assert its text is rendered
      expect(button.text()).toContain(mockDropdownButtonText)

      // Assert the open/close icon state is ignored by assistive technologies
      const iconWrapper = button.find("[data-testid='burger-menu__dropdown-button-icon-wrapper']")
      expect(iconWrapper.attributes('aria-hidden')).toBe('true')

      // Assert the open icon is rendered
      const icon = button.find("[data-testid='icon-sign-minus']")
      expect(icon.isVisible()).toBeTruthy()
    })

    test('renders all links with their necessary information', () => {
      // Find the links
      const list = wrapper.find("[data-testid='burger-menu__dropdown-list']")
      const links = list.findAllComponents(RouterLinkStub)

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
        expect(link.props('to')).toBe(mockLinkURL)

        // Assert the link's text is well rendered
        expect(link.text()).toContain(mockLinkText)
      })
    })
  })

  describe('Dropdown close state', () => {
    test('renders the dropdown toggle button with necessary information', async () => {
      // Close the dropdown
      const button = wrapper.find("[data-testid='burger-menu__dropdown-button']")
      await button.trigger('click')

      // Assert the dropdown is close
      const list = wrapper.find("[data-testid='burger-menu__dropdown-list']")
      expect(list.isVisible()).toBeFalsy()

      // Assert the close icon is rendered
      const icon = button.find("[data-testid='icon-sign-plus']")
      expect(icon.isVisible()).toBeTruthy()
    })
  })

  describe('Behaviors:', () => {
    /************/
    /* Dropdown */
    /************/

    test('the dropdown is open by default', () => {
      const list = wrapper.find("[data-testid='burger-menu__dropdown-list']")
      expect(list.isVisible()).toBeTruthy()
    })

    /**************************/
    /* Dropdown toggle button */
    /**************************/

    test('when the toggle button is touched, it opens/closes the dropdown', async () => {
      const button = wrapper.find("[data-testid='burger-menu__dropdown-button']")
      let list

      // Touch the button
      await button.trigger('click')

      // Assert the dropdown is close
      list = wrapper.find("[data-testid='burger-menu__dropdown-list']")
      expect(list.isVisible()).toBeFalsy()

      // Touch the button again
      await button.trigger('click')

      // Assert the dropdown is open again
      list = wrapper.find("[data-testid='burger-menu__dropdown-list']")
      expect(list.isVisible()).toBeTruthy()
    })

    /*********/
    /* Links */
    /*********/

    test('when each link is touched, it commands the burger menu to close', async () => {
      // Find the links
      const list = wrapper.find("[data-testid='burger-menu__dropdown-list']")
      const links = list.findAllComponents(RouterLinkStub)

      for (let index = 0; index < links.length; index++) {
        // Reset the burger menu state to open
        mockIsBurgerMenuOpenStore.isBurgerMenuOpen = true

        // Assert the burger menu state is open
        expect(mockIsBurgerMenuOpenStore.isBurgerMenuOpen).toBe(true)

        // Touch the link
        await links[index].trigger('click')

        // Assert the burger menu state is close
        expect(mockIsBurgerMenuOpenStore.isBurgerMenuOpen).toBe(false)
      }
    })
  })
})
