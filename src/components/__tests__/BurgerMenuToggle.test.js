import { flushPromises, mount } from '@vue/test-utils'
import BurgerMenuToggle from '../BurgerMenuToggle.vue'
import IconBurger from '../icons/IconBurger.vue'
import IconCross from '../icons/IconCross.vue'
import SiteHeaderIcon from '../SiteHeaderIcon.vue'
import { createTestingPinia } from '@pinia/testing'
import { defineStore } from 'pinia'
import { ref } from 'vue'

/********************/
/* 1.Initialization */
/********************/

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

// Component factory
function mountBurgerMenuToggle() {
  return mount(BurgerMenuToggle, {
    plugins: [mockPinia],
  })
}

/**********/
/* 3.Test */
/**********/

describe('BurgerMenuToggle.vue', () => {
  let wrapper

  beforeEach(() => {
    mockIsBurgerMenuOpenStore.isBurgerMenuOpen = false // reset the burger menu to close status
    wrapper = mountBurgerMenuToggle()
  })

  // Smoke Test
  test('mounts successfully', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  test('renders the burger icon with necessary information, when the burger menu is close', () => {
    const SiteHeaderIconComponent = wrapper.findComponent(SiteHeaderIcon)
    const IconBurgerComponent = wrapper.findComponent(IconBurger)

    // Assert the SiteHeaderIconComponent is rendered
    expect(SiteHeaderIconComponent.exists()).toBeTruthy()

    // Assert the "alternativeText" prop has the correct value
    expect(SiteHeaderIconComponent.props('alternativeText')).toContain('Open burger menu')

    // Assert the IconBurger component is rendered
    expect(IconBurgerComponent.exists()).toBeTruthy()

    /**********************/
    /* SiteHeaderIcon.vue */
    /**********************/

    const icon = wrapper.find("[data-testid='icon-burger']")

    // Assert the icon is rendered
    expect(icon.exists()).toBeTruthy()
  })

  test('renders the cross icon with necessary information, when the burger menu is open', async () => {
    // Open the burger menu
    mockIsBurgerMenuOpenStore.isBurgerMenuOpen = true

    // Wait until the burger menu is opened
    await flushPromises()

    // Find the SiteHeaderIconComponent
    const SiteHeaderIconComponent = wrapper.findComponent(SiteHeaderIcon)

    // Assert the SiteHeaderIconComponent is rendered
    expect(SiteHeaderIconComponent.exists()).toBeTruthy()

    // Assert the "alternativeText" prop has the correct value
    expect(SiteHeaderIconComponent.props('alternativeText')).toContain('Close burger menu')

    // Find the IconCross component
    const IconCrossComponent = wrapper.findComponent(IconCross)

    // Assert the IconCross component is rendered
    expect(IconCrossComponent.exists()).toBeTruthy()

    /**********************/
    /* SiteHeaderIcon.vue */
    /**********************/

    const icon = wrapper.find("[data-testid='icon-cross']")

    // Assert the icon is rendered
    expect(icon.exists()).toBeTruthy()
  })

  describe('Behaviors:', () => {
    test('when the button is clicked, it commands the burger menu to toggle', async () => {
      // Assert that the store indicates the burger menu is open
      expect(mockIsBurgerMenuOpenStore.isBurgerMenuOpen).toBe(false)

      // Click on the button
      const button = wrapper.find("[data-testid='site-header__burger-menu-toggle']")
      const clickEvent = new MouseEvent('click', { detail: 1 }) // simulate a button click
      await button.element.dispatchEvent(clickEvent)

      // Assert that the store indicates the burger menu is close
      expect(mockIsBurgerMenuOpenStore.isBurgerMenuOpen).toBe(true)
    })

    test('when we press the Enter key on the button, it commands the burger menu to toggle', async () => {
      // Assert that the store indicates the burger menu is open
      expect(mockIsBurgerMenuOpenStore.isBurgerMenuOpen).toBe(false)

      // Click on the button
      const button = wrapper.find("[data-testid='site-header__burger-menu-toggle']")
      const clickEvent = new MouseEvent('click', { detail: 0 }) // simulate an "enter" key pressed
      await button.element.dispatchEvent(clickEvent)

      // Assert that the store indicates the burger menu is close
      expect(mockIsBurgerMenuOpenStore.isBurgerMenuOpen).toBe(true)
    })
  })

  /* Note : This component should focus on the first burger menu item when the burger menu is opened using the 'Enter' key.
  However, this test cannot be executed because the targeted element is not accessible from this component.
  Therefore, an integration test should be written in the App.vue test file for this purpose. */
})
