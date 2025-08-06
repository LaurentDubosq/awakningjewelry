import { mount, RouterLinkStub } from '@vue/test-utils'
import SiteFooterList from '@/components/SiteFooterList.vue'
import frontDataBase from '../../../db.json'

/********************/
/* 1.Initialization */
/********************/

/* Data */

const mockSiteFooter = frontDataBase.siteFooter
const mockLinks = mockSiteFooter.links
const mockLinksLength = mockLinks.length

/***********/
/* 2.Build */
/***********/

// Component mounting
const mountSiteFooterList = () => {
  return mount(SiteFooterList, {
    props: { links: mockLinks },
    global: {
      stubs: {
        RouterLink: RouterLinkStub,
      },
    },
  })
}

/**********/
/* 3.Test */
/**********/

describe('SiteFooterList.vue', () => {
  let wrapper

  beforeEach(() => {
    // Component mounting
    wrapper = mountSiteFooterList()
  })

  // Smoke Tests
  test('mounts successfully', async () => {
    // Assert the wrapper component is well mounted at initial render
    expect(wrapper.exists()).toBeTruthy()
  })

  test('renders all links with necessary information', async () => {
    // Find the link lists
    const links = wrapper.findAllComponents(RouterLinkStub)

    // Assert all link lists are rendered
    expect(links).toHaveLength(mockLinksLength)

    // Assert each list link is rendered with its necessary information
    for (let index = 0; index < links.length; index++) {
      const link = links[index]
      const mockLink = mockLinks[index]
      const mockLinkText = mockLink.text
      const mockLinkURL = mockLink.url

      // Assert the link exists
      expect(link.exists()).toBeTruthy()

      // Assert the link text is rendered
      expect(link.text()).toContain(mockLinkText)

      // Assert the link has the correct url
      expect(link.props('to')).toBe(mockLinkURL)
    }
  })
})
