import { mount, RouterLinkStub } from '@vue/test-utils'
import BurgerMenuDropdown from '@/components/BurgerMenuDropdown.vue'
import BurgerMenuDropdownButton from '@/components/BurgerMenuDropdownButton.vue'
import BurgerMenuDropdownList from '@/components/BurgerMenuDropdownList.vue'
import frontDataBase from '../../../db.json'
import { createTestingPinia } from '@pinia/testing'
import { defineStore } from 'pinia'
import { ref } from 'vue'

/********************/
/* 1.Initialization */
/********************/

/* Data */

const mockDropdown = frontDataBase.siteMenu[1]
const mockDropdownText = mockDropdown.text
const mockLinks = mockDropdown.subMenu

/* Stores */

// Initialize a testing pinia instance
const mockPinia = createTestingPinia({ stubActions: false })

// Create the stores
const mockUseIsBurgerMenuOpenStore = defineStore('IsBurgerMenuOpen', () => {
  const isBurgerMenuOpen = ref(true)
  const toggleBurgerMenu = () => {
    isBurgerMenuOpen.value = !isBurgerMenuOpen.value
  }
  return { isBurgerMenuOpen, toggleBurgerMenu }
})

// Initialize the stores
mockUseIsBurgerMenuOpenStore()

/***********/
/* 2.Build */
/***********/

// Component Factory
function mountBurgerMenuDropdown() {
  return mount(BurgerMenuDropdown, {
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

describe('BurgerMenuDropdown.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mountBurgerMenuDropdown()
  })

  // Smoke test
  test('mounts successfully', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  test('renders the button component with necessary information', () => {
    const buttonComponent = wrapper.findComponent(BurgerMenuDropdownButton)

    // Assert the button component is rendered
    expect(buttonComponent.exists()).toBeTruthy()

    // Assert the "text" prop has the correct value
    expect(buttonComponent.props('text')).toContain(mockDropdownText)

    // Assert the "isDropdownOpen" prop has the correct value
    expect(buttonComponent.props('isDropdownOpen')).toBe(true)
  })

  test('renders the list component with necessary information', () => {
    const listComponent = wrapper.findComponent(BurgerMenuDropdownList)

    // Assert the list component is rendered
    expect(listComponent.exists()).toBeTruthy()

    // Assert the "links" prop has the correct value
    expect(listComponent.props('links')).toStrictEqual(mockLinks)

    // Assert the "dropdownText" prop has the correct value
    expect(listComponent.props('dropdownText')).toBe(mockDropdownText)
  })

  describe('Behaviors:', () => {
    test('the dropdown is open at initial render', () => {
      // Find the dropdown list component
      const listComponent = wrapper.findComponent(BurgerMenuDropdownList)

      // Assert the dropdown is open
      expect(listComponent.exists()).toBeTruthy()
    })

    describe('Touch Navigation:', () => {
      test('when the button is touched, it opens/closes the dropdown', async () => {
        let ListComponent

        // Assert the dropdown is open
        ListComponent = wrapper.findComponent(BurgerMenuDropdownList)
        expect(ListComponent.exists()).toBeTruthy()

        // Touch the button
        const button = wrapper.find("[data-testid='burger-menu__dropdown-button']")
        await button.trigger('click')

        // Assert the dropdown is close
        expect(ListComponent.exists()).toBeFalsy()

        // Touch the button again
        await button.trigger('click')

        // Assert the dropdown is open again
        ListComponent = wrapper.findComponent(BurgerMenuDropdownList)
        expect(ListComponent.exists()).toBeTruthy()
      })
    })

    describe('Renders:', () => {
      test('when the dropdown is open, the sign minus icon is rendered', () => {
        /* We target the icon instead of component because we decided to not have tests for SVG components */

        // Find the icon
        const icon = wrapper.find("[data-testid='icon-sign-minus']")

        // Assert the icon is rendered
        expect(icon.exists()).toBeTruthy()
      })

      test('when the dropdown is close, the sign plus icon is rendered', async () => {
        /* We target the icon instead of component because we decided to not have tests for SVG components */

        // Close the dropdown
        const button = wrapper.find("[data-testid='burger-menu__dropdown-button']")
        await button.trigger('click')

        // Find the list component
        const ListComponent = wrapper.findComponent(BurgerMenuDropdownList)

        // Assert the dropdown is close
        expect(ListComponent.exists()).toBeFalsy()

        // Find the icon
        const icon = wrapper.find("[data-testid='icon-sign-plus']")

        // Assert the icon is rendered
        expect(icon.exists()).toBeTruthy()
      })
    })
  })
})
