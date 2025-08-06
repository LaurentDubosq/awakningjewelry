import { mount, RouterLinkStub } from '@vue/test-utils'
import SiteFooterItem from '@/components/SiteFooterItem.vue'
import frontDataBase from '../../../db.json'

/********************/
/* 1.Initialization */
/********************/

/* Data */

const mockSiteFooter = frontDataBase.siteFooter
const mockLink = mockSiteFooter.links[0]
const mockLinkText = mockLink.text
const mockLinkURL = mockLink.url
const mockSocialLink = mockSiteFooter.socialLinks[0]
const mockSocialLinkText = mockSocialLink.text
const mockSocialLinkURL = mockSocialLink.url
const mockSocialLinkAlt = mockSocialLink.alt
const mockSocialLinkTitle = mockSocialLink.title
const mockSocialLinkLogo = mockSocialLink.logo

/***********/
/* 2.Build */
/***********/

// Component Factory (Neutral link state)
const mountSiteFooterItem = (props) => {
  return mount(SiteFooterItem, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub,
      },
    },
    ...props,
  })
}

/**********/
/* 3.Test */
/**********/

// WARNING : The component has 2 variants regarding its link version. Social link version or not. There is none used by default.

describe('SiteFooterItem.vue', () => {
  // Smoke Tests
  test('mounts successfully', async () => {
    let wrapper

    /********************************************************************/
    /* Assert the component is well mounted when the link is not social */
    /********************************************************************/

    // Mount the component (not social version)
    wrapper = mountSiteFooterItem({
      props: { link: mockLink },
    })

    // Assert the wrapper component is well mounted
    expect(wrapper.exists()).toBeTruthy()

    /****************************************************************/
    /* Assert the component is well mounted when the link is social */
    /****************************************************************/

    // Mount the component (social version)
    wrapper = mountSiteFooterItem({
      props: { link: mockSocialLink },
    })

    // Assert the wrapper component is well mounted
    expect(wrapper.exists()).toBeTruthy()
  })

  test('renders not social link with necessary information', async () => {
    // Mount the component (not social version)
    const wrapper = mountSiteFooterItem({
      props: { link: mockLink },
    })

    // Find the link
    const link = wrapper.findComponent(RouterLinkStub)

    // Assert the link exists
    expect(link.exists()).toBeTruthy()

    // Assert the link text is rendered
    expect(link.text()).toContain(mockLinkText)

    // Assert the link has the correct url
    expect(link.props('to')).toBe(mockLinkURL)
  })

  test('renders social link with necessary information', async () => {
    // Mount the component (social version)
    const wrapper = mountSiteFooterItem({
      props: { link: mockSocialLink },
    })

    // Find the social link
    const socialLink = wrapper.find("[data-testid='site-footer__social-links-list-item-link']")

    // Assert the social link exists
    expect(socialLink.exists()).toBeTruthy()

    // Assert the social link text is rendered
    expect(socialLink.text()).toContain(mockSocialLinkText)

    // Assert the social link has the correct url
    expect(socialLink.attributes('href')).toBe(mockSocialLinkURL)

    // Assert the social link title has the correct text
    expect(socialLink.attributes('title')).toBe(mockSocialLinkTitle)

    // Assert the social link aria-label is rendered
    expect(socialLink.attributes('aria-label')).toBe(mockSocialLinkAlt)

    // Assert the social link logo is rendered
    expect(socialLink.classes()).toContain('site-footer__list-item-link--before')
    switch (mockSocialLinkLogo) {
      case 'facebook':
        expect(socialLink.classes()).toContain('site-footer__list-item-link-logo-facebook')
    }
  })
})
