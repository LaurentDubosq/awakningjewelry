import { mount } from '@vue/test-utils'
import SiteNavDropdownButton from '@/components/SiteNavDropdownButton.vue'
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
function mountSiteNavDropdownButton(propsOptions = {}) {
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

describe('SiteNavDropdownButton.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mountSiteNavDropdownButton()
  })

  // Smoke test
  test('mounts successfully', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  test('renders the button with necessary information', () => {
    const button = wrapper.find("[data-testid='site-nav__dropdown-button']")

    // Assert the button is rendered
    expect(button.exists()).toBeTruthy()

    // Assert the button's text is rendered
    expect(button.text()).toContain(mockDropdownText)
  })

  describe('Behaviors:', () => {
    test("when the dropdown is open, the '▲' icon is rendered", () => {
      // Remount the component in the state of an open dropdown
      wrapper = mountSiteNavDropdownButton({ isDropdownOpen: true })

      // Assert the open icon is rendered
      const button = wrapper.find("[data-testid='site-nav__dropdown-button']")
      expect(button.text()).toContain('▲')
    })

    test("when the dropdown is close, the '▼' icon is rendered", () => {
      const button = wrapper.find("[data-testid='site-nav__dropdown-button']")
      expect(button.text()).toContain('▼')
    })

    test('when the button is focused, it commands the dropdown to open', async () => {
      const button = wrapper.find("[data-testid='site-nav__dropdown-button']")

      // Focus the button
      await button.trigger('focus')

      // Assert the order to open the dropdown has been emitted
      expect(wrapper.emitted('open-dropdown')).toHaveLength(1)
    })
  })
})
