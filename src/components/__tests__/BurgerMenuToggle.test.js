import { mount } from '@vue/test-utils'
import BurgerMenuToggle from '../BurgerMenuToggle.vue'
import { createTestingPinia } from '@pinia/testing'
import { defineStore } from 'pinia'
import { nextTick, ref } from 'vue'

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

// Component factory (Burger menu close state)
function mountBurgerMenuToggle() {
  return mount(BurgerMenuToggle, {
    plugins: [mockPinia],
  })
}

/**********/
/* 3.Test */
/**********/

// WARNING : The component has 2 states regarding the burger menu status. Open or close. The state by default is close.

describe('BurgerMenuToggle.vue', () => {
  let wrapper
  let clickEventTriggeredByEnter

  beforeEach(() => {
    // Component mounting (Burger menu close state)
    wrapper = mountBurgerMenuToggle()
  })

  afterEach(() => {
    // Reset the store(s) state(s) to default to ensure a clean environment for each test
    mockIsBurgerMenuOpenStore.isBurgerMenuOpen = false

    // Reset custom event to avoid alteration over time
    clickEventTriggeredByEnter = new MouseEvent('click', { detail: 0 })

    // Reset function call count
    vi.clearAllMocks()
  })

  // Smoke Test
  test('mounts successfully', () => {
    // Assert the wrapper component is well mounted at initial render
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('Initial render - Burger menu close state', () => {
    test('renders the toggle button with necessary information', () => {
      // Assert the button is rendered
      const button = wrapper.find("[data-testid='burger-menu-toggle-button']")
      expect(button.exists()).toBeTruthy()

      // Assert the burger icon is rendered
      const icon = button.find("[data-testid='icon-burger']")
      expect(icon.exists()).toBeTruthy()

      // Assert the alternative text is rendered
      const alternativeText = button.find("[data-testid='site-header__icon-text']")
      expect(alternativeText.text()).toContain('Open burger menu')
    })
  })

  describe('Burger menu open state', () => {
    test('renders the toggle button with necessary information', async () => {
      // Set the burger menu status as open
      mockIsBurgerMenuOpenStore.isBurgerMenuOpen = true
      await nextTick()

      // Assert the cross icon is rendered
      const icon = wrapper.find("[data-testid='icon-cross']")
      expect(icon.exists()).toBeTruthy()

      // Assert the alternative text is rendered
      const alternativeText = wrapper.find("[data-testid='site-header__icon-text']")
      expect(alternativeText.text()).toContain('Close burger menu')
    })
  })

  describe('Behaviors:', () => {
    /***************/
    /* Burger menu */
    /***************/

    test('the burger menu is close by default', () => {
      // Assert the burger menu opener icon is rendered
      const icon = wrapper.find("[data-testid='icon-burger']")
      expect(icon.exists()).toBeTruthy()
    })

    /*****************************/
    /* Burger menu toggle button */
    /*****************************/

    test('when the toggle button is touched 2 times, it commands the burger menu to open and close', async () => {
      // Assert the burger menu status is close
      expect(mockIsBurgerMenuOpenStore.isBurgerMenuOpen).toBe(false)

      // Find the button
      const button = wrapper.find("[data-testid='burger-menu-toggle-button']")

      // Touch on the button
      await button.trigger('click')

      // Assert the burger menu status is open
      expect(mockIsBurgerMenuOpenStore.isBurgerMenuOpen).toBe(true)

      // Touch on the button again
      await button.trigger('click')

      // Assert the burger menu status is close
      expect(mockIsBurgerMenuOpenStore.isBurgerMenuOpen).toBe(false)
    })

    test('when we press the "Enter" key on the opening button, it commands the burger menu to open, then it commands the focus on the first burger menu focusable element', async () => {
      // Assert the burger menu status is close
      expect(mockIsBurgerMenuOpenStore.isBurgerMenuOpen).toBe(false)

      // Commands the burger menu to open by pressing the "enter" key
      const button = wrapper.find("[data-testid='burger-menu-toggle-button']")
      await button.element.dispatchEvent(clickEventTriggeredByEnter)

      // Assert the burger menu status is open
      expect(mockIsBurgerMenuOpenStore.isBurgerMenuOpen).toBe(true)

      // Assert the commands to focus the first focusable burger menu element has been ordered
      expect(mockIsBurgerMenuOpenStore.toggleBurgerMenu).toHaveBeenCalledTimes(1)
    })

    test('when we press the "Enter" key on the closing button, it commands the burger menu to close', async () => {
      // Set the burger menu status as open
      mockIsBurgerMenuOpenStore.isBurgerMenuOpen = true

      // Assert the burger menu status is open
      expect(mockIsBurgerMenuOpenStore.isBurgerMenuOpen).toBe(true)

      // Commands the burger menu to close by pressing the "enter" key
      const button = wrapper.find("[data-testid='burger-menu-toggle-button']")
      await button.element.dispatchEvent(clickEventTriggeredByEnter)

      // Assert the burger menu status is close
      expect(mockIsBurgerMenuOpenStore.isBurgerMenuOpen).toBe(false)
    })
  })
})
