import { mount } from '@vue/test-utils'
import BurgerMenuToggle from '../BurgerMenuToggle.vue'
import IconBurger from '../icons/IconBurger.vue'
import IconCross from '../icons/IconCross.vue'
import { isBurgerMenuOpenKey, toggleBurgerMenuKey } from '@/utils/injectionkeys'
import SiteHeaderIcon from '../SiteHeaderIcon.vue'

let toggleBurgerMenu = vi.fn()

// Component factory
function mountBurgerMenuToggle(providers = {}) {
  return mount(BurgerMenuToggle, {
    global: {
      provide: {
        [isBurgerMenuOpenKey]: false,
        [toggleBurgerMenuKey]: toggleBurgerMenu,
        ...providers,
      },
    },
  })
}

describe('BurgerMenuToggle.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mountBurgerMenuToggle()
    vi.clearAllMocks()
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

  test('renders the cross icon with necessary information, when the burger menu is open', () => {
    // Remount the component simulating the burger menu open
    wrapper = mountBurgerMenuToggle({ [isBurgerMenuOpenKey]: true })

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
      const button = wrapper.find("[data-testid='site-header__burger-menu-toggle']")

      // Click on the button
      const clickEvent = new MouseEvent('click', { detail: 1 }) // simulate a button click
      await button.element.dispatchEvent(clickEvent)

      // Assert the order to open/close the burger menu has been triggered
      expect(toggleBurgerMenu).toHaveBeenCalledTimes(1)
    })

    test('when we press the Enter key on the button, it commands the burger menu to toggle', async () => {
      const button = wrapper.find("[data-testid='site-header__burger-menu-toggle']")

      // Press Enter on the button
      const clickEvent = new MouseEvent('click', { detail: 0 }) // simulate an "enter" key pressed
      await button.element.dispatchEvent(clickEvent)

      // Assert the order to open/close the burger menu has been triggered
      expect(toggleBurgerMenu).toHaveBeenCalledTimes(1)
    })
  })

  /* Note : This component should focus on the first item when the burger menu is opened using the 'Enter' key.
  However, this test cannot be executed because the targeted element is not accessible from this component.
  Therefore, an integration test should be written in the App.vue test file for this purpose. */
})
