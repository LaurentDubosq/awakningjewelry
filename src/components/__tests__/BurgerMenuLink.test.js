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
const pinia = createTestingPinia({ stubActions: false })

// Create the stores
const useIsBurgerMenuOpenStore = defineStore('IsBurgerMenuOpen', () => {
  const isBurgerMenuOpen = ref(true)
  const toggleBurgerMenu = () => {
    isBurgerMenuOpen.value = !isBurgerMenuOpen.value
  }
  return { isBurgerMenuOpen, toggleBurgerMenu }
})

// Initialize the stores
const isBurgerMenuOpenStore = useIsBurgerMenuOpenStore()

/***********/
/* 2.Build */
/***********/

// Component Factory
function mountBurgerMenuLink() {
  return mount(BurgerMenuLink, {
    props: { link: mockLink },
    global: {
      plugins: [pinia],
      stubs: { RouterLink: RouterLinkStub },
    },
  })
}

/**********/
/* 3.Test */
/**********/

describe('BurgerMenuLink.vue', () => {
  let wrapper
  let link

  beforeEach(() => {
    wrapper = mountBurgerMenuLink()
    link = wrapper.findComponent(RouterLinkStub)
  })

  // Smoke test
  test('mounts successfully', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  test('renders the link with necessary information', () => {
    // Assert the link exists
    expect(link.exists()).toBeTruthy()

    // Assert the link has the correct url
    expect(link.props('to')).toBe(mockLinkURL)

    // Assert the link text is rendered
    expect(link.text()).toContain(mockLinkText)
  })

  describe('Behaviors:', () => {
    test('when the link is clicked, it commands the burger menu to close', async () => {
      // Assert that the store indicates the burger menu is open
      expect(isBurgerMenuOpenStore.isBurgerMenuOpen).toBe(true)

      // Click on the link
      await link.trigger('click')

      // Assert that the store indicates the burger menu is close
      expect(isBurgerMenuOpenStore.isBurgerMenuOpen).toBe(false)
    })
  })
})
