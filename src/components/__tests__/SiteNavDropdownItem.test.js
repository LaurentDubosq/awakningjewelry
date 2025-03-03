import { mount } from '@vue/test-utils'
import SiteNavDropdownItem from '@/components/SiteNavDropdownItem.vue'
import router from '@/router'
import { closeSiteNavDropdownKey } from '@/utils/injectionkeys'
import frontDataBase from '../../../db.json'

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
const mockLink = mockSiteMenu[1].subMenu[0]
const mockLinkText = mockSiteMenu[1].subMenu[0].text
const mockLinkURL = mockSiteMenu[1].subMenu[0].url
const mockCloseSiteNavDropdown = vi.fn()

/***********/
/* 3.Build */
/***********/

// Component Factory
function mountSiteNavDropdownItem(propsOptions = {}) {
  return mount(SiteNavDropdownItem, {
    props: { link: mockLink, ...propsOptions },
    global: {
      plugins: [router],
      provide: { [closeSiteNavDropdownKey]: mockCloseSiteNavDropdown },
    },
  })
}

/**********/
/* 4.Test */
/**********/

describe('SiteNavDropdownItem.vue', () => {
  let wrapper
  let link

  beforeEach(() => {
    wrapper = mountSiteNavDropdownItem()
    link = wrapper.find("[data-testid='site-nav__dropdown-item-link']")
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
    test('when the link is clicked, it commands the dropdown to close', async () => {
      // Click on the link
      await link.trigger('click')

      // Assert the open/close dropdown function has been triggered
      expect(mockCloseSiteNavDropdown).toHaveBeenCalledTimes(1)
    })
  })
})
