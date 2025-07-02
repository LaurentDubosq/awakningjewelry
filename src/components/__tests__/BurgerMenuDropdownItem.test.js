import { mount, RouterLinkStub } from '@vue/test-utils'
import BurgerMenuDropdownItem from '@/components/BurgerMenuDropdownItem.vue'
import frontDataBase from '../../../db.json'
import { createTestingPinia } from '@pinia/testing'
import { defineStore } from 'pinia'
import { ref } from 'vue'

/********************/
/* 1.Initialization */
/********************/

/* Data */

const mockSiteMenu = frontDataBase['siteMenu']
const mockLink = mockSiteMenu[1].links[0]
const mockLinkText = mockLink.text
const mockLinkURL = mockLink.url

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
function mountBurgerMenuDropdownItem() {
  return mount(BurgerMenuDropdownItem, {
    props: { link: mockLink },
    global: {
      plugins: [mockPinia],
      stubs: { RouterLink: RouterLinkStub },
    },
  })
}

/**********/
/* 3.Test */
/**********/

describe('BurgerMenuDropdownItem.vue', () => {
  let wrapper

  beforeEach(() => {
    // Component mounting
    wrapper = mountBurgerMenuDropdownItem()
  })

  afterEach(() => {
    // Reset the store(s) state(s) to default to ensure a clean environment for each test
    mockIsBurgerMenuOpenStore.isBurgerMenuOpen = false
  })

  // Smoke test
  test('mounts successfully', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  test('renders the link with necessary information', () => {
    // Find the link
    const link = wrapper.findComponent(RouterLinkStub)

    // Assert the link is rendered
    expect(link.exists()).toBeTruthy()

    // Assert the link has the correct url
    expect(link.props('to')).toBe(mockLinkURL)

    // Assert the link's text is well rendered
    expect(link.text()).toContain(mockLinkText)
  })

  describe('Behaviors:', () => {
    test('when the link is touched, it commands the dropdown to close', async () => {
      // Set the burger menu state to open
      mockIsBurgerMenuOpenStore.isBurgerMenuOpen = true

      // Assert the burger menu state is open
      expect(mockIsBurgerMenuOpenStore.isBurgerMenuOpen).toBe(true)

      // Touch the link
      const link = wrapper.findComponent(RouterLinkStub)
      await link.trigger('click')

      // Assert the burger menu state is close
      expect(mockIsBurgerMenuOpenStore.isBurgerMenuOpen).toBe(false)
    })
  })
})
