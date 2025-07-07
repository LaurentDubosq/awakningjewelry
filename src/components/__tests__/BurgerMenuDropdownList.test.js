import { mount, RouterLinkStub } from '@vue/test-utils'
import BurgerMenuDropdownList from '@/components/BurgerMenuDropdownList.vue'
import frontDataBase from '../../../db.json'
import { createTestingPinia } from '@pinia/testing'
import { defineStore } from 'pinia'
import { ref } from 'vue'

/********************/
/* 1.Initialization */
/********************/

/* Data */

const mockSiteMenu = frontDataBase['siteMenu']
const mockDropdown = mockSiteMenu[1]
const mockButtonText = mockDropdown.button.text
const mockLinks = mockDropdown.links
const mockLinksLength = mockLinks.length

/* Stores */

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

// Component Factory
const mountBurgerMenuDropdownList = () => {
  return mount(BurgerMenuDropdownList, {
    props: { links: mockLinks, id: mockButtonText },
    global: {
      plugins: [mockPinia],
      stubs: { RouterLink: RouterLinkStub },
    },
  })
}

/**********/
/* 3.Test */
/**********/

describe('BurgerMenuDropdownList.vue', () => {
  let wrapper

  beforeEach(() => {
    // Component mounting
    wrapper = mountBurgerMenuDropdownList()
  })

  afterEach(() => {
    // Reset the store(s) state(s) to default to ensure a clean environment for each test
    mockIsBurgerMenuOpenStore.isBurgerMenuOpen = false
  })

  // Smoke test
  test('mounts successfully', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  test('renders all links with their necessary information', () => {
    // Find the links
    const links = wrapper.findAllComponents(RouterLinkStub)

    // Assert all links are rendered
    expect(links).toHaveLength(mockLinksLength)

    // Assert each link is rendered with its necessary information
    links.forEach((link, index) => {
      const mockLink = mockLinks[index]
      const mockLinkURL = mockLink.url
      const mockLinkText = mockLink.text

      // Assert the link is rendered
      expect(link.exists()).toBeTruthy()

      // Assert the link has the correct url
      expect(link.props('to')).toBe(mockLinkURL)

      // Assert the link's text is well rendered
      expect(link.text()).toContain(mockLinkText)
    })
  })

  describe('Behaviors:', () => {
    test('when each link is touched, it commands the burger menu to close', async () => {
      // Find the links
      const links = wrapper.findAllComponents(RouterLinkStub)

      // Assert each link touched command the burger menu to close
      for (let index = 0; index < links.length; index++) {
        // Reset the burger menu state to open
        mockIsBurgerMenuOpenStore.isBurgerMenuOpen = true

        // Assert the burger menu state is open
        expect(mockIsBurgerMenuOpenStore.isBurgerMenuOpen).toBe(true)

        // Touch the link
        await links[index].trigger('click')

        // Assert the burger menu state is close
        expect(mockIsBurgerMenuOpenStore.isBurgerMenuOpen).toBe(false)
      }
    })
  })
})
