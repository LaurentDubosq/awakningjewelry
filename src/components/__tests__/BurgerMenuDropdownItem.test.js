import { mount } from '@vue/test-utils'
import BurgerMenuDropdownItem from '@/components/BurgerMenuDropdownItem.vue'
import router from '@/router'
import frontDataBase from '../../../db.json'
import { createTestingPinia } from '@pinia/testing'
import { defineStore } from 'pinia'
import { ref } from 'vue'

/**************/
/* 1.Hoisting */
/**************/

// Mock the "getPagesMetaData" data fetcher used in the mocked router
vi.mock('@/data/dataFetchers', () => {
  return {
    getPagesMetaData: vi.fn().mockReturnValue(undefined),
  }
})

/********************/
/* 2.Initialization */
/********************/

/* Data */

const mockSiteMenu = frontDataBase['siteMenu']
const mockLink = mockSiteMenu[1].subMenu[0]
const mockLinkText = mockSiteMenu[1].subMenu[0].text
const mockLinkURL = mockSiteMenu[1].subMenu[0].url

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
/* 3.Build */
/***********/

// Component Factory
function mountBurgerMenuDropdownItem(propsOptions = {}) {
  return mount(BurgerMenuDropdownItem, {
    props: { link: mockLink, ...propsOptions },
    global: {
      plugins: [router, pinia],
    },
  })
}

/**********/
/* 4.Test */
/**********/

describe('BurgerMenuDropdownItem.vue', () => {
  let wrapper
  let link

  beforeEach(() => {
    wrapper = mountBurgerMenuDropdownItem()
    link = wrapper.find("[data-testid='burger-menu__dropdown-item-link']")
  })

  // Smoke test
  test('mounts successfully', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  test('renders the link with necessary information', () => {
    // Assert the link is rendered
    expect(link.exists()).toBeTruthy()

    // Assert the link has the correct url
    expect(link.attributes('href')).toContain(mockLinkURL)

    // Assert the link's text is well rendered
    expect(link.text()).toContain(mockLinkText)
  })

  describe('Behaviors:', () => {
    test('when the link is touched, it commands the dropdown to close', async () => {
      // Assert that the store indicates the burger menu is open
      expect(isBurgerMenuOpenStore.isBurgerMenuOpen).toBe(true)

      // Touch the link
      await link.trigger('click')

      // Assert that the store indicates the burger menu is close
      expect(isBurgerMenuOpenStore.isBurgerMenuOpen).toBe(false)
    })
  })
})
