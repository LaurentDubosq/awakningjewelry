import { mount } from '@vue/test-utils'
import SiteNavDropdown from '@/components/SiteNavDropdown.vue'
import frontDataBase from '../../../db.json'
import { createRouter, createWebHistory } from 'vue-router'
import { defineComponent } from 'vue'
import { beforeEach } from 'vitest'

/********************/
/* 1.Initialization */
/********************/

/* Router */

const mockRouter = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      component: defineComponent({
        template: '<div>Mocked Component</div>',
      }),
    },
  ],
})

/* Data */

const mockSiteMenu = frontDataBase['siteMenu']
const mockDropdown = mockSiteMenu[1]
const mockDropdownButton = mockDropdown.button
const mockDropdownButtonText = mockDropdownButton.text
const mockDropdownButtonTitle = mockDropdownButton.title
const mockDropdownLinks = mockDropdown.links

/***********/
/* 2.Build */
/***********/

// Component Factory (Dropdown close state)
function mountSiteNavDropdown() {
  return mount(SiteNavDropdown, {
    attachTo: document.body,
    props: { dropdown: mockDropdown },
    global: {
      plugins: [mockRouter],
    },
  })
}

/**********/
/* 3.Test */
/**********/

// WARNING : The component has 2 states regarding its opening state. Open or close. The state by default is close.

describe('SiteNavDropdown.vue', () => {
  let wrapper

  beforeEach(() => {
    // Component mounting (Dropdown close state)
    wrapper = mountSiteNavDropdown()
  })

  // Smoke test
  test('mounts successfully', async () => {
    // Assert the wrapper component is well mounted at initial render
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('Initial render - Dropdown close state', () => {
    test('renders the dropdown toggle button with necessary information', () => {
      // Find the button
      const button = wrapper.find("[data-testid='site-nav__dropdown-button']")

      // Assert the button is rendered
      expect(button.exists()).toBeTruthy()

      // Assert its text is rendered
      expect(button.text()).toContain(mockDropdownButtonText)

      // Assert its title is rendered
      expect(button.attributes('title')).toBe(mockDropdownButtonTitle)

      // Assert the close icon is rendered
      expect(button.text()).toContain('▼')
    })
  })

  describe('Dropdown open state', () => {
    beforeEach(async () => {
      // Open the dropdown
      const dropdown = wrapper.find("[data-testid='site-nav__dropdown']")
      await dropdown.trigger('mouseenter')
    })

    test('renders the dropdown toggle button with necessary information', () => {
      // Assert the dropdown is open
      const list = wrapper.find("[data-testid='site-nav__dropdown-list']")
      expect(list.isVisible()).toBeTruthy()

      // Assert the open icon is rendered
      const button = wrapper.find("[data-testid='site-nav__dropdown-button']")
      expect(button.text()).toContain('▲')
    })

    test('renders all links with their necessary information', async () => {
      // Assert the dropdown is open
      const list = wrapper.find("[data-testid='site-nav__dropdown-list']")
      expect(list.isVisible()).toBeTruthy()

      // Assert all links are rendered
      const links = list.findAll("[data-testid='site-nav__dropdown-item-link']")
      expect(links).toHaveLength(mockDropdownLinks.length)

      // Assert that each link is rendered with its necessary information
      links.forEach((link, index) => {
        const mockLink = mockDropdownLinks[index]
        const mockLinkURL = mockLink.url
        const mockLinkText = mockLink.text

        // Assert the link is rendered
        expect(link.exists()).toBeTruthy()

        // Assert the link has the correct url
        expect(link.attributes('href')).toBe(mockLinkURL)

        // Assert the link has the correct title
        expect(link.attributes('title')).toBe(`Explore our ${mockLinkText}`)

        // Assert the link text is well rendered
        expect(link.text()).toContain(mockLinkText)
      })
    })
  })

  describe('Behaviors:', () => {
    /************/
    /* Dropdown */
    /************/

    test('the dropdown is close by default', () => {
      // Find the dropdown list
      const list = wrapper.find("[data-testid='site-nav__dropdown-list']")

      // Assert the dropdown is close
      expect(list.isVisible()).toBeFalsy()
    })

    test('when the mouse enters and leaves the dropdown, it open/close the dropdown', async () => {
      let list
      let dropdown

      // Assert the dropdown is close
      list = wrapper.find("[data-testid='site-nav__dropdown-list']")
      expect(list.isVisible()).toBeFalsy()

      // Mouse enters the dropdown
      dropdown = wrapper.find("[data-testid='site-nav__dropdown']")
      await dropdown.trigger('mouseenter')

      // Assert the dropdown is open
      list = wrapper.find("[data-testid='site-nav__dropdown-list']")
      expect(list.isVisible()).toBeTruthy()

      // Mouse leaves the dropdown
      await dropdown.trigger('mouseleave')

      // Assert the dropdown is close
      list = wrapper.find("[data-testid='site-nav__dropdown-list']")
      expect(list.isVisible()).toBeFalsy()
    })

    test('when we navigate through the dropdown using keyboard and focus on external element of the dropdown, it closes the dropdown', async () => {
      let list

      // Open the dropdown
      const dropdown = wrapper.find("[data-testid='site-nav__dropdown']")
      await dropdown.trigger('mouseenter')

      // Assert the dropdown is open
      list = wrapper.find("[data-testid='site-nav__dropdown-list']")
      expect(list.isVisible()).toBeTruthy()

      // Focus the last link
      const links = list.findAll("[data-testid='site-nav__dropdown-item-link']")
      links[links.length - 1].element.focus() // this method guarantee that the DOM element will be focused

      // Focusout the last link element to focus on external element
      await wrapper.trigger('focusout', {
        relatedTarget: document.body,
      })

      // Assert the dropdown is close
      list = wrapper.find("[data-testid='site-nav__dropdown-list']")
      expect(list.isVisible()).toBeFalsy()
    })

    test('when we navigate through the dropdown using keyboard and press the "Escape" key, it closes the dropdown', async () => {
      let dropdown
      let list

      // Open the dropdown
      dropdown = wrapper.find("[data-testid='site-nav__dropdown']")
      await dropdown.trigger('mouseenter')

      // Assert the dropdown is open
      list = wrapper.find("[data-testid='site-nav__dropdown-list']")
      expect(list.isVisible()).toBeTruthy()

      // Focus the first link
      const links = list.findAll("[data-testid='site-nav__dropdown-item-link']")
      links[0].element.focus() // this method guarantee that the DOM element will be focused

      // Press the "Escape" key
      dropdown = wrapper.find("[data-testid='site-nav__dropdown']")
      await dropdown.trigger('keydown.escape')

      // Assert the dropdown is close
      list = wrapper.find("[data-testid='site-nav__dropdown-list']")
      expect(list.isVisible()).toBeFalsy()
    })

    /**************************/
    /* Dropdown toggle button */
    /**************************/

    test('when the toggle button is focused, it open the dropdown', async () => {
      let list

      // Assert the dropdown is close
      list = wrapper.find("[data-testid='site-nav__dropdown-list']")
      expect(list.isVisible()).toBeFalsy()

      // Focus the button
      const button = wrapper.find("[data-testid='site-nav__dropdown-button']")
      await button.trigger('focus')

      // Assert the dropdown is open
      list = wrapper.find("[data-testid='site-nav__dropdown-list']")
      expect(list.isVisible()).toBeTruthy()
    })

    test('when the toggle button is touched, it open/close the dropdown', async () => {
      let list

      // Assert the dropdown is close
      list = wrapper.find("[data-testid='site-nav__dropdown-list']")
      expect(list.isVisible()).toBeFalsy()

      // Touch the button
      const button = wrapper.find("[data-testid='site-nav__dropdown-button']")
      await button.trigger('touchend')

      // Assert the dropdown is open
      list = wrapper.find("[data-testid='site-nav__dropdown-list']")
      expect(list.isVisible()).toBeTruthy()

      // Touch the button again
      await button.trigger('touchend')

      // Assert the dropdown is close
      list = wrapper.find("[data-testid='site-nav__dropdown-list']")
      expect(list.isVisible()).toBeFalsy()
    })

    /*********/
    /* Links */
    /*********/

    test('when each dropdown link is clicked, it close the dropdown', async () => {
      let dropdown
      let list

      // Open the dropdown
      dropdown = wrapper.find("[data-testid='site-nav__dropdown']")
      await dropdown.trigger('mouseenter')

      // Assert the dropdown is open
      list = wrapper.find("[data-testid='site-nav__dropdown-list']")
      expect(list.isVisible()).toBeTruthy()

      // Find the dropdown and the links
      dropdown = wrapper.find("[data-testid='site-nav__dropdown']")
      const links = list.findAll("[data-testid='site-nav__dropdown-item-link']")

      // Assert that each dropdown link clicked, closes the dropdown
      for (let index = 0; index < links.length; index++) {
        // Open the dropdown
        await dropdown.trigger('mouseenter')

        // Assert the dropdown is open
        list = wrapper.find("[data-testid='site-nav__dropdown-list']")
        expect(list.isVisible()).toBeTruthy()

        // Click on the link
        await links[index].trigger('click')

        // Assert the dropdown is close
        list = wrapper.find("[data-testid='site-nav__dropdown-list']")
        expect(list.isVisible()).toBeFalsy()
      }
    })
  })
})
