import { mount } from '@vue/test-utils'
import BurgerMenuDropdownButton from '@/components/BurgerMenuDropdownButton.vue'
import frontDataBase from '../../../db.json'

/********************/
/* 1.Initialization */
/********************/

const mockDropdown = frontDataBase.siteMenu[1]
const mockDropdownText = mockDropdown.text
const mockDropdownTitle = mockDropdown.title

/***********/
/* 2.Build */
/***********/

// Component Factory
function mountBurgerMenuDropdownButton(propsOptions = {}) {
  return mount(BurgerMenuDropdownButton, {
    props: {
      text: mockDropdownText,
      title: mockDropdownTitle,
      isDropdownOpen: true,
      ...propsOptions,
    },
  })
}

/**********/
/* 3.Test */
/**********/

describe('BurgerMenuDropdownButton.vue', () => {
  let wrapper
  let button

  beforeEach(() => {
    wrapper = mountBurgerMenuDropdownButton()
    button = wrapper.find("[data-testid='burger-menu__dropdown-button']")
  })

  // Smoke test
  test('mounts successfully', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  test('renders the button with necessary information', () => {
    // Assert the button is rendered
    expect(button.exists()).toBeTruthy()

    // Assert its text is rendered
    expect(button.text()).toContain(mockDropdownText)
  })

  describe('Behaviors:', () => {
    test('when the dropdown is open, the sign minus icon is rendered', () => {
      /* We target the icon instead of component because we decided to not have tests for SVG components */

      // Find the icon
      const icon = wrapper.find("[data-testid='icon-sign-minus']")

      // Assert the icon is rendered
      expect(icon.exists()).toBeTruthy()
    })

    test('when the dropdown is close, the sign plus icon is rendered', () => {
      /* We target the icon instead of component because we decided to not have tests for SVG components */

      // Remount the component in the state of a close dropdown
      wrapper = mountBurgerMenuDropdownButton({ isDropdownOpen: false })

      // Find the icon
      const icon = wrapper.find("[data-testid='icon-sign-plus']")

      // Assert the icon is rendered
      expect(icon.exists()).toBeTruthy()
    })

    test('when the button is touched, its commands the dropdown to open/close', async () => {
      // Touch the button
      await button.trigger('click')

      // Assert the order to open/close the button has been emitted
      expect(wrapper.emitted('toggle-dropdown')).toHaveLength(1)
    })
  })
})
