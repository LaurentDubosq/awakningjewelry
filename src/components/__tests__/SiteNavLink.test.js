import { mount, RouterLinkStub } from '@vue/test-utils'
import SiteNavLink from '@/components/SiteNavLink.vue'
import IconPerson from '@/components/icons/IconPerson.vue'
import frontDataBase from '../../../db.json'

/********************/
/* 1.Initialization */
/********************/

const mockSiteMenu = frontDataBase['siteMenu']

const mockLinkTypeText = mockSiteMenu[0]
const mockLinkTypeTextURL = mockLinkTypeText.url
const mockLinkTypeTextText = mockLinkTypeText.text
const mockLinkTypeTextTitle = mockLinkTypeText.title

const mockLinkTypeIcon = mockSiteMenu[4]
const mockLinkTypeIconURL = mockLinkTypeIcon.url
const mockLinkTypeIconTitle = mockLinkTypeIcon.title
const mockLinkTypeIconAlternativeText = mockLinkTypeIcon.text

/***********/
/* 2.Build */
/***********/

// Component Factory (Neutral type variant)
const mountSiteNavLink = (options) => {
  return mount(SiteNavLink, {
    global: {
      stubs: { RouterLink: RouterLinkStub },
    },
    ...options,
  })
}

/**********/
/* 3.Test */
/**********/

// WARNING : The component has 2 variants regarding its type content. "Text" or "Icon". There is none used by default.

describe('SiteNavLink.vue', () => {
  // Smoke test
  test('mounts successfully', () => {
    let wrapper

    /*************************************************************************/
    /* Assert the component is well mounted when the link is in text variant */
    /*************************************************************************/

    // Mount the component (text variant)
    wrapper = mountSiteNavLink({
      props: { link: mockLinkTypeText },
    })

    // Assert the wrapper component is well mounted
    expect(wrapper.exists()).toBeTruthy()

    /*************************************************************************/
    /* Assert the component is well mounted when the link is in icon variant */
    /*************************************************************************/

    // Mount the component (icon variant)
    wrapper = mountSiteNavLink({
      props: { link: mockLinkTypeIcon },
      slots: { default: IconPerson },
    })

    // Assert the wrapper component is well mounted
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('Text variant', () => {
    test('renders the link with necessary information', () => {
      // Mount the component (text variant)
      const wrapper = mountSiteNavLink({
        props: { link: mockLinkTypeText },
      })

      // Find the link
      const link = wrapper.findComponent(RouterLinkStub)

      // Assert the link exists
      expect(link.exists()).toBeTruthy()

      // Assert the link has the correct url
      expect(link.props('to')).toBe(mockLinkTypeTextURL)

      // Assert the link title is rendered
      expect(link.attributes('title')).toBe(mockLinkTypeTextTitle)

      // Assert the link text is rendered
      expect(link.text()).toContain(mockLinkTypeTextText)
    })
  })

  describe('Icon variant', () => {
    test('renders the link with necessary information', () => {
      // Mount the component
      const wrapper = mountSiteNavLink({
        props: { link: mockLinkTypeIcon },
        slots: { default: IconPerson },
      })

      // Find our necessary elements
      const link = wrapper.findComponent(RouterLinkStub)
      const icon = wrapper.find("[data-testid='icon-person']")
      const alternativeText = wrapper.find("[data-testid='site-header__icon-text']")

      // Assert the link exists
      expect(link.exists()).toBeTruthy()

      // Assert the link has the correct url
      expect(link.props('to')).toBe(mockLinkTypeIconURL)

      // Assert the link title has the correct value
      expect(link.attributes('title')).toBe(mockLinkTypeIconTitle)

      // Assert the icon is rendered
      expect(icon.exists()).toBeTruthy()

      // Assert the alternative text is rendered
      expect(alternativeText.text()).toContain(mockLinkTypeIconAlternativeText)
    })
  })
})
