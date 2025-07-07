import { mount } from '@vue/test-utils'
import SiteNavDropdownButton from '@/components/SiteNavDropdownButton.vue'
import frontDataBase from '../../../db.json'

/********************/
/* 1.Initialization */
/********************/

const mockDropdown = frontDataBase.siteMenu[1]
const mockDropdownText = mockDropdown.button.text
const mockDropdownTitle = mockDropdown.button.title

/***********/
/* 2.Build */
/***********/

// Component Factory (Dropdown close state)
const mountSiteNavDropdownButton = (propsOptions = {}) => {
  return mount(SiteNavDropdownButton, {
    props: {
      text: mockDropdownText,
      title: mockDropdownTitle,
      isDropdownOpen: false,
      ...propsOptions,
    },
  })
}

/**********/
/* 3.Test */
/**********/

// WARNING : The component has 2 states regarding its opening state. Open or close. The state by default is close.

describe('SiteNavDropdownButton.vue', () => {
  let wrapper

  beforeEach(() => {
    // Component mounting (Dropdown close state)
    wrapper = mountSiteNavDropdownButton({ isDropdownOpen: false })
  })

  // Smoke test
  test('mounts successfully', () => {
    // Assert the wrapper component is well mounted at initial render
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('Initial render - Dropdown close state', () => {
    test('renders the dropdown toggle button with necessary information', () => {
      // Find the button
      const button = wrapper.find("[data-testid='site-nav__dropdown-button']")

      // Assert the button is rendered
      expect(button.exists()).toBeTruthy()

      // Assert the button text is rendered
      expect(button.text()).toContain(mockDropdownText)

      // Assert the button title is rendered
      expect(button.attributes('title')).toBe(mockDropdownTitle)

      // Assert the close icon is rendered
      expect(button.text()).toContain('▼')
    })
  })

  describe('Dropdown open state', () => {
    test('renders the toggle button with necessary information', () => {
      // Component mounting  (Dropdown open state)
      wrapper = mountSiteNavDropdownButton({ isDropdownOpen: true })

      // Assert the open icon is rendered
      const button = wrapper.find("[data-testid='site-nav__dropdown-button']")
      expect(button.text()).toContain('▲')
    })
  })

  describe('Behaviors:', () => {
    test('the dropdown is close by default', () => {
      // Assert the close icon is rendered
      expect(wrapper.text()).toContain('▼')
    })

    test('when the toggle button is focused, it commands the dropdown to open', async () => {
      // Focus the button
      const button = wrapper.find("[data-testid='site-nav__dropdown-button']")
      await button.trigger('focus')

      // Assert the order to open the dropdown has been emitted
      expect(wrapper.emitted('openDropdown')).toHaveLength(1)
    })

    test('when the toggle button is touched, it commands the dropdown to open/close', async () => {
      // Touch the button
      const button = wrapper.find("[data-testid='site-nav__dropdown-button']")
      await button.trigger('touchend')

      // Assert the order to open the dropdown has been emitted
      expect(wrapper.emitted('toggleDropdown')).toHaveLength(1)
    })
  })
})
