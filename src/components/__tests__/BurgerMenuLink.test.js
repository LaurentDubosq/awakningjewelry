import { mount } from '@vue/test-utils'
import BurgerMenuLink from '@/components/BurgerMenuLink.vue'
import frontDataBase from '../../../db.json'
import router from '@/router'
import { toggleBurgerMenuKey } from '@/utils/injectionkeys'

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

const mockSiteMenu = frontDataBase['siteMenu']
const mockLink = mockSiteMenu[0]
const mockLinkURL = mockLink.url
const mockLinkText = mockLink.text
const mockToggleBurgerMenu = vi.fn()

/***********/
/* 3.Build */
/***********/

// Component Factory
function mountBurgerMenuLink() {
  return mount(BurgerMenuLink, {
    props: { link: mockLink },
    global: {
      plugins: [router],
      provide: { [toggleBurgerMenuKey]: mockToggleBurgerMenu },
    },
  })
}

/**********/
/* 4.Test */
/**********/

describe('BurgerMenuLink.vue', () => {
  let wrapper
  let link

  beforeEach(() => {
    wrapper = mountBurgerMenuLink()
    link = wrapper.find("[data-testid='burger-menu__link']")
  })

  // Smoke test
  test('mounts successfully', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  test('renders the link with necessary information', () => {
    // Assert the link exists
    expect(link.exists()).toBeTruthy()

    // Assert the link tag has the correct url
    expect(link.attributes('href')).toBe(mockLinkURL)

    // Assert the link text is rendered
    expect(link.text()).toContain(mockLinkText)
  })

  describe('Behaviors:', () => {
    test('when the link is clicked, it commands the burger menu to close', async () => {
      // Click on the link
      await link.trigger('click')

      // Assert the order to close the burger menu has been triggered
      expect(mockToggleBurgerMenu).toHaveBeenCalledTimes(1)
    })
  })
})
