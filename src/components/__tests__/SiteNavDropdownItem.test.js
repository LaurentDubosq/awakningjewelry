import { mount, RouterLinkStub } from '@vue/test-utils'
import SiteNavDropdownItem from '@/components/SiteNavDropdownItem.vue'
import { closeDropdownKey } from '@/utils/injectionkeys'
import frontDataBase from '../../../db.json'

/********************/
/* 1.Initialization */
/********************/

const mockSiteMenu = frontDataBase['siteMenu']
const mockLink = mockSiteMenu[1].links[0]
const mockLinkText = mockLink.text
const mockLinkURL = mockLink.url
const mockCloseSiteNavDropdown = vi.fn()

/***********/
/* 2.Build */
/***********/

// Component Factory
const mountSiteNavDropdownItem = () => {
  return mount(SiteNavDropdownItem, {
    props: { link: mockLink },
    global: {
      provide: { [closeDropdownKey]: mockCloseSiteNavDropdown },
      stubs: { RouterLink: RouterLinkStub },
    },
  })
}

/**********/
/* 3.Test */
/**********/

describe('SiteNavDropdownItem.vue', () => {
  let wrapper

  beforeEach(() => {
    // Component mounting
    wrapper = mountSiteNavDropdownItem()
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

    // Assert the link has the correct title
    expect(link.attributes('title')).toBe(`Explore our ${mockLinkText}`)

    // Assert the link's text is well rendered
    expect(link.text()).toContain(mockLinkText)
  })

  describe('Behaviors:', () => {
    test('when the link is clicked, it commands the dropdown to close', async () => {
      // Click on the link
      const link = wrapper.findComponent(RouterLinkStub)
      await link.trigger('click')

      // Assert the open/close dropdown function has been triggered
      expect(mockCloseSiteNavDropdown).toHaveBeenCalledTimes(1)
    })
  })
})
