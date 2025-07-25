import { mount, RouterLinkStub } from '@vue/test-utils'
import SiteNavDropdownList from '@/components/SiteNavDropdownList.vue'
import { closeDropdownKey } from '@/utils/injectionkeys'
import frontDataBase from '../../../db.json'

/********************/
/* 1.Initialization */
/********************/

const mockSiteMenu = frontDataBase['siteMenu']
const mockDropdown = mockSiteMenu[1]
const mockDropdownButtonText = mockDropdown.button.text
const mockDropdownLinks = mockDropdown.links
const mockDropdownLinksLength = mockDropdownLinks.length
const mockCloseSiteNavDropdown = vi.fn()

/***********/
/* 2.Build */
/***********/

// Component Factory
const mountSiteNavDropdownList = () => {
  return mount(SiteNavDropdownList, {
    props: { links: mockDropdownLinks, id: mockDropdownButtonText },
    global: {
      provide: { [closeDropdownKey]: mockCloseSiteNavDropdown },
      stubs: { RouterLink: RouterLinkStub },
    },
  })
}

/**********/
/* 3.Test */
/**********/

describe('SiteNavDropdownList.vue', () => {
  let wrapper

  beforeEach(() => {
    // Component mounting
    wrapper = mountSiteNavDropdownList()
  })

  // Smoke test
  test('mounts successfully', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  test('renders all links with their necessary information', () => {
    // Find the links
    const links = wrapper.findAllComponents(RouterLinkStub)

    // Assert all links are rendered
    expect(links).toHaveLength(mockDropdownLinksLength)

    // Assert that each link is rendered with necessary information
    links.forEach((link, index) => {
      const mockLink = mockDropdownLinks[index]
      const mockLinkURL = mockLink.url
      const mockLinkText = mockLink.text

      // Assert the link is rendered
      expect(link.exists()).toBeTruthy()

      // Assert the link has the correct url
      expect(link.props('to')).toBe(mockLinkURL)

      // Assert the link has the correct title
      expect(link.attributes('title')).toBe(`Explore our ${mockLinkText}`)

      // Assert the link text is well rendered
      expect(link.text()).toContain(mockLinkText)
    })
  })

  describe('Behaviors:', () => {
    test('when each link is clicked, it commands the dropdown to close', async () => {
      // Find the links
      const links = wrapper.findAllComponents(RouterLinkStub)

      // Assert that each link is rendered with necessary information
      for (let index = 0; index < links.length; index++) {
        // Click on the link
        await links[index].trigger('click')

        // Assert the open/close dropdown function has been triggered
        expect(mockCloseSiteNavDropdown).toHaveBeenCalledTimes(index + 1)
      }
    })
  })
})
