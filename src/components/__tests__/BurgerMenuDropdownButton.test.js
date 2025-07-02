import { mount } from '@vue/test-utils'
import BurgerMenuDropdownButton from '@/components/BurgerMenuDropdownButton.vue'
import frontDataBase from '../../../db.json'

/********************/
/* 1.Initialization */
/********************/

const mockDropdown = frontDataBase.siteMenu[1]
const mockDropdownText = mockDropdown.button.text

/***********/
/* 2.Build */
/***********/

// Component Factory (Dropdown open state)
function mountBurgerMenuDropdownButton(propsOptions = {}) {
  return mount(BurgerMenuDropdownButton, {
    attachTo: document.body,
    props: {
      text: mockDropdownText,
      isDropdownOpen: true,
      ...propsOptions,
    },
  })
}

/**********/
/* 3.Test */
/**********/

// WARNING : The component has 2 states regarding its opening state. Open or close. The state by default is open.

describe('BurgerMenuDropdownButton.vue', () => {
  let wrapper

  beforeEach(() => {
    // Component mounting (Dropdown open state)
    wrapper = mountBurgerMenuDropdownButton()
  })

  // Smoke test
  test('mounts successfully', () => {
    // Assert the wrapper component is well mounted at initial render
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('Initial render - Dropdown open state', () => {
    test('renders the dropdown toggle button with necessary information', () => {
      // Find the button
      const button = wrapper.find("[data-testid='burger-menu__dropdown-button']")

      // Assert the button is rendered
      expect(button.exists()).toBeTruthy()

      // Assert its text is rendered
      expect(button.text()).toContain(mockDropdownText)

      // Assert the open/close icon state is ignored by assistive technologies
      const iconWrapper = button.find("[data-testid='burger-menu__dropdown-button-icon-wrapper']")
      expect(iconWrapper.attributes('aria-hidden')).toBe('true')

      // Assert the open icon is rendered
      const icon = button.find("[data-testid='icon-sign-minus']")
      expect(icon.isVisible()).toBeTruthy()
    })
  })

  describe('Dropdown close state', () => {
    test('renders the dropdown toggle button with necessary information', () => {
      // Remount the component in the state of a close dropdown
      const wrapper = mountBurgerMenuDropdownButton({ isDropdownOpen: false })

      // Assert the close icon is rendered
      const button = wrapper.find("[data-testid='burger-menu__dropdown-button']")
      const icon = button.find("[data-testid='icon-sign-plus']")
      expect(icon.isVisible()).toBeTruthy()
    })
  })

  describe('Behaviors:', () => {
    /************/
    /* Dropdown */
    /************/

    test('the dropdown is open by default', () => {
      // Assert the icon is rendered
      const icon = wrapper.find("[data-testid='icon-sign-minus']")
      expect(icon.exists()).toBeTruthy()
    })

    /**************************/
    /* Dropdown toggle button */
    /**************************/

    test('when the toggle button is touched, its commands the dropdown to open/close', async () => {
      // Touch the button
      const button = wrapper.find("[data-testid='burger-menu__dropdown-button']")
      await button.trigger('click')

      // Assert the order to open/close the button has been emitted
      expect(wrapper.emitted('toggle-dropdown')).toHaveLength(1)
    })
  })
})
