import { mount, RouterLinkStub } from '@vue/test-utils'
import BurgerMenuLink from '@/components/BurgerMenuLink.vue'
import frontDataBase from '../../../db.json'
import { createTestingPinia } from '@pinia/testing'
import { defineStore } from 'pinia'
import { ref } from 'vue'

/********************/
/* 1.Initialization */
/********************/

/* Data */

const mockSiteMenu = frontDataBase['siteMenu']
const mockLink = mockSiteMenu[0]
const mockLinkURL = mockLink.url
const mockLinkText = mockLink.text

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
function mountBurgerMenuLink() {
  return mount(BurgerMenuLink, {
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

describe('BurgerMenuLink.vue', () => {
  let wrapper

  beforeEach(() => {
    // Component mounting
    wrapper = mountBurgerMenuLink()
  })

  // Smoke test
  test('mounts successfully', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  test('renders the link with necessary information', () => {
    // Find the link
    const link = wrapper.findComponent(RouterLinkStub)

    // Assert the link exists
    expect(link.exists()).toBeTruthy()

    // Assert the link has the correct url
    expect(link.props('to')).toBe(mockLinkURL)

    // Assert the link text is rendered
    expect(link.text()).toContain(mockLinkText)
  })

  describe('Behaviors:', () => {
    test('when the link is touched, it commands the burger menu to close', async () => {
      // Set the burger menu status to open
      mockIsBurgerMenuOpenStore.isBurgerMenuOpen = true

      // Assert burger menu status is open
      expect(mockIsBurgerMenuOpenStore.isBurgerMenuOpen).toBe(true)

      // Touch on the link
      const link = wrapper.findComponent(RouterLinkStub)
      await link.trigger('click')

      // Assert burger menu status is close
      expect(mockIsBurgerMenuOpenStore.isBurgerMenuOpen).toBe(false)
    })
  })
})
