import { mount, RouterLinkStub } from '@vue/test-utils'
import SiteNavDropdown from '@/components/SiteNavDropdown.vue'
import SiteNavDropdownButton from '@/components/SiteNavDropdownButton.vue'
import SiteNavDropdownList from '@/components/SiteNavDropdownList.vue'
import frontDataBase from '../../../db.json'

/********************/
/* 1.Initialization */
/********************/

const mockSiteMenu = frontDataBase['siteMenu']
const mockDropdown = mockSiteMenu[1]
const mockDropdownText = mockDropdown.text
const mockDropdownTitle = mockDropdown.title
const mockLinks = mockDropdown.subMenu

/***********/
/* 2.Build */
/***********/

// Component Factory
function mountSiteNavDropdown() {
  return mount(SiteNavDropdown, {
    props: { dropdown: mockDropdown },
    global: {
      stubs: { RouterLink: RouterLinkStub },
    },
  })
}

/**********/
/* 3.Test */
/**********/

describe('SiteNavDropdown.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mountSiteNavDropdown()
  })

  // Smoke test
  test('mounts successfully', () => {
    const wrapper = mountSiteNavDropdown()
    expect(wrapper.exists()).toBeTruthy()
  })

  test('render the button component with necessary information', () => {
    const buttonComponent = wrapper.findComponent(SiteNavDropdownButton)

    // Assert the button component is rendered
    expect(buttonComponent.exists()).toBeTruthy()

    // Assert the "text" prop has the correct value
    expect(buttonComponent.props('text')).toBe(mockDropdownText)

    // Assert the "title" prop has the correct value
    expect(buttonComponent.props('title')).toBe(mockDropdownTitle)

    // Assert the "isDropdownOpen" prop has the correct value
    expect(buttonComponent.props('isDropdownOpen')).toBe(false)
  })

  describe('Behaviors:', () => {
    test('the dropdown is close at initial render', () => {
      // Find the dropdown list component
      const listComponent = wrapper.findComponent(SiteNavDropdownList)

      // Assert the dropdown is close
      expect(listComponent.exists()).toBeFalsy()
    })

    describe('Mouse Navigation', () => {
      test('opens/closes the dropdown when the mouse enters and leaves it', async () => {
        // Mouse enters the dropdown
        const dropdown = wrapper.find("[data-testid='site-nav__dropdown']")
        await dropdown.trigger('mouseenter')

        // Assert the dropdown is open
        const listComponent = wrapper.findComponent(SiteNavDropdownList)
        expect(listComponent.exists()).toBeTruthy()

        // Mouse leaves the dropdown
        await dropdown.trigger('mouseleave')

        // Assert the dropdown is close
        expect(listComponent.exists()).toBeFalsy()
      })

      test('Provide/inject: when user clicks on a dropdown link, it closes the dropdown', async () => {
        // Open the dropdown
        const dropdown = wrapper.find("[data-testid='site-nav__dropdown']")
        await dropdown.trigger('mouseenter')

        // Assert the dropdown is open
        const listComponent = wrapper.findComponent(SiteNavDropdownList)
        expect(listComponent.exists()).toBeTruthy()

        // Click on the first link
        const link = wrapper.find("[data-testid='site-nav__dropdown-item-link']")
        await link.trigger('click')

        // Assert the dropdown is close
        expect(listComponent.exists()).toBeFalsy()
      })
    })

    describe('Keyboard navigation', () => {
      let button
      let listComponent

      beforeEach(async () => {
        // Open the dropdown
        button = wrapper.find("[data-testid='site-nav__dropdown-button']")
        await button.trigger('focus')

        // Find the dropdown list component
        listComponent = wrapper.findComponent(SiteNavDropdownList)
      })

      test('when the button is focused, it opens the dropdown', async () => {
        expect(listComponent.exists()).toBeTruthy()
      })

      test('when we navigate using keyboard and focus on external element of the dropdown, it closes the dropdown', async () => {
        // Assert the dropdown is open
        expect(listComponent.exists()).toBeTruthy()

        // Find the last link
        const links = listComponent.findAll("[data-testid='site-nav__dropdown-item-link']")

        // Focus the link
        await wrapper.trigger('focus', {
          relatedTarget: links[links.length - 1].element,
        })

        // Focusout the last link element to focus on external element
        await wrapper.trigger('focusout', {
          relatedTarget: document.body,
        })

        // Assert the dropdown is close
        expect(listComponent.exists()).toBeFalsy()
      })

      test('when we navigate using keyboard and press the Escape key, it closes the dropdown', async () => {
        // Assert the dropdown is open
        expect(listComponent.exists()).toBeTruthy()

        // Press the Escape key
        const dropdown = wrapper.find("[data-testid='site-nav__dropdown']")
        await dropdown.trigger('keydown.escape')

        // Assert the dropdown is close
        expect(listComponent.exists()).toBeFalsy()
      })
    })
  })

  describe('Renders:', () => {
    test("when the dropdown is close, the button renders the '▼' icon", async () => {
      const button = wrapper.find("[data-testid='site-nav__dropdown-button']")
      expect(button.text()).toContain('▼')
    })

    test("when the dropdown is open, the button renders the '▲' icon", async () => {
      // Open the dropdown
      const dropdown = wrapper.find("[data-testid='site-nav__dropdown']")
      await dropdown.trigger('mouseenter')

      // Assert the dropdown is open
      const listComponent = wrapper.findComponent(SiteNavDropdownList)
      expect(listComponent.exists()).toBeTruthy()

      // Assert the expected icon is rendered
      const button = wrapper.find("[data-testid='site-nav__dropdown-button']")
      expect(button.text()).toContain('▲')
    })

    test('when the dropdown is open, the list component is rendered with necessary information', async () => {
      // Open the dropdown
      const dropdown = wrapper.find("[data-testid='site-nav__dropdown']")
      await dropdown.trigger('mouseenter')

      // Assert the list component is rendered
      const listComponent = wrapper.findComponent(SiteNavDropdownList)
      expect(listComponent.exists()).toBeTruthy()

      // Assert the "links" prop has the correct value
      expect(listComponent.props('links')).toStrictEqual(mockLinks)

      // Assert the "dropdownText" prop has the correct value
      expect(listComponent.props('dropdownText')).toBe(mockDropdownText)
    })
  })
})
