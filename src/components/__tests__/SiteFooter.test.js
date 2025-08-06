import { mount, RouterLinkStub } from '@vue/test-utils'
import SiteFooter from '@/components/SiteFooter.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import frontDataBase from '../../../db.json'
import { getSiteFooter, getPaymentSolutions } from '@/data/dataFetchers'

/**************/
/* 1.Hoisting */
/**************/

// Mock the "getSiteFooter" and "getPaymentSolutions" fetcher
vi.mock('@/data/dataFetchers', () => {
  return {
    getSiteFooter: vi.fn(),
    getPaymentSolutions: vi.fn(),
  }
})

/********************/
/* 2.Initialization */
/********************/

/* Data */

const mockSiteFooterPending = {
  data: undefined,
  state: 'pending',
}
const mockSiteFooterRejected = {
  data: undefined,
  state: 'rejected',
}
const mockSiteFooterFulfilled = {
  data: { value: frontDataBase.siteFooter },
  state: 'fulfilled',
}
const mockSiteFooter = mockSiteFooterFulfilled.data.value
const mockLinks = mockSiteFooter.links
const mockLinksLength = mockLinks.length
const mockSocialLinks = mockSiteFooter.socialLinks
const mockSocialLinksLength = mockSocialLinks.length
const mockCopyrightPrefixText = `© ${new Date().getFullYear()}`
const mockCopyrightBrandText = 'Awakning Buddhist Jewelry'
const mockCopyrightBrandURL = '/'
const mockTechnologyProviderText = 'Powered by Shopify'
const mockTechnologyProviderURL =
  'https://www.shopify.com/?utm_campaign=poweredby&utm_medium=shopify&utm_source=onlinestore'
const mockPaymentSolutionsFulfilled = {
  data: frontDataBase.paymentSolutions,
  state: 'fulfilled',
}
const mockPaymentSolutions = mockPaymentSolutionsFulfilled.data
const mockPaymentSolutionsLength = mockPaymentSolutions.length

/***********/
/* 3.Build */
/***********/

// Component mounting (Data fetching "Pending" state)
const mountSiteFooter = () => {
  return mount(SiteFooter, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub,
      },
    },
  })
}

/**********/
/* 4.Test */
/**********/

// WARNING : The component has 3 states regarding the data fetching state. "Pending", "Rejected" and "Fulfilled". The state by default is "Pending".

describe('SiteFooter.vue', () => {
  let wrapper

  beforeEach(() => {
    // Set the getSiteFooter fetcher mock state to pending
    getSiteFooter.mockReturnValue(mockSiteFooterPending)

    // Component mounting (Data fetching "Pending" state)
    wrapper = mountSiteFooter()
  })

  // Smoke Tests
  test('mounts successfully', async () => {
    // Assert the wrapper component is well mounted at initial render
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('Initial render - Data fetching "Pending" state', () => {
    test('the loader is rendered', async () => {
      // Assert the loading component is rendered
      const loadingComponent = wrapper.findComponent(LoadingComponent)
      expect(loadingComponent.exists()).toBeTruthy()
    })
  })

  describe('Data fetching "Rejected" state', () => {
    test('the error message is rendered', () => {
      // Set the getSiteFooter fetcher mock state to rejected
      getSiteFooter.mockReturnValue(mockSiteFooterRejected)

      // Remount the component with the rejected state
      wrapper = mountSiteFooter()

      // Assert the error message is rendered
      const errorComponent = wrapper.findComponent(ErrorComponent)
      expect(errorComponent.exists()).toBeTruthy()
    })
  })

  describe('Data fetching "Fulfilled" state', async () => {
    beforeEach(() => {
      // Set the getSiteFooter fetcher mock state to fulfilled
      getSiteFooter.mockReturnValue(mockSiteFooterFulfilled)

      // Set the getPaymentSolutions fetcher mock state to fulfilled
      getPaymentSolutions.mockReturnValue(mockPaymentSolutionsFulfilled)

      // Remount the component with the fulfilled state
      wrapper = mountSiteFooter()
    })

    test('renders all links with necessary information', async () => {
      // Find the link lists
      const lists = wrapper.findAll("[data-testid='site-footer__list']")
      let links = []
      for (const list of lists) {
        const linkComponents = list.findAllComponents(RouterLinkStub)
        if (linkComponents.length) {
          for (const linkComponent of linkComponents) {
            links.push(linkComponent)
          }
        }
      }

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

    test('renders all social links with necessary information', async () => {
      // Find the link lists
      const socialLinks = wrapper.findAll(
        "[data-testid='site-footer__social-links-list-item-link']",
      )

      // Assert all link lists are rendered
      expect(socialLinks).toHaveLength(mockSocialLinksLength)

      // Assert each list link is rendered with its necessary information
      for (let index = 0; index < socialLinks.length; index++) {
        const socialLink = socialLinks[index]
        const mockSocialLink = mockSocialLinks[index]
        const mockSocialLinkText = mockSocialLink.text
        const mockSocialLinkURL = mockSocialLink.url
        const mockSocialLinkAlt = mockSocialLink.alt
        const mockSocialLinkTitle = mockSocialLink.title
        const mockSocialLinkLogo = mockSocialLink.logo

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
      }
    })

    test('renders the copyright with necessary information', () => {
      const copyright = wrapper.find("[data-testid='site-footer__copyright']")
      const copyrightBrandLink = copyright.findComponent(RouterLinkStub)

      // Assert the prefix is rendered
      expect(copyright.text()).toContain(mockCopyrightPrefixText)

      // Assert the brand is rendered
      expect(copyright.text()).toContain(mockCopyrightBrandText)

      // Assert the brand has a link
      expect(copyrightBrandLink.exists()).toBeTruthy()

      // Assert the brand link has the correct url
      expect(copyrightBrandLink.props('to')).toBe(mockCopyrightBrandURL)
    })

    test('renders the technology provider', () => {
      const technologyProvider = wrapper.find("[data-testid='site-footer__technology-provider']")
      const technologyProviderLink = technologyProvider.find(
        "[data-testid='site-footer__technology-provider-link']",
      )

      // Assert the text is rendered
      expect(technologyProvider.text()).toBe(mockTechnologyProviderText)

      // Assert the text has a link
      expect(technologyProviderLink.exists()).toBeTruthy()

      // Assert the link has the correct url
      expect(technologyProviderLink.attributes('href')).toBe(mockTechnologyProviderURL)
    })

    test('renders the payment solutions', () => {
      // Assert the payment solutions aria-label is rendered
      const list = wrapper.find("[data-testid='payment-solutions']")
      expect(list.attributes('aria-label')).toBe('Payment solutions')

      // Assert all the badges are rendered
      const badges = wrapper.findAll("[data-testid='payment-solution']")
      expect(badges).toHaveLength(mockPaymentSolutionsLength)

      // Assert each badge is rendered with necessary informations
      for (let index = 0; index < badges.length; index++) {
        const badge = badges[index]
        const mockBadge = mockPaymentSolutions[index]
        const mockBadgeURL = mockBadge.url
        const mockBadgeAlt = mockBadge.alt
        const mockBadgeTitle = mockBadge.title

        // Assert the badge has the correct url
        expect(badge.attributes('src')).toBe(mockBadgeURL)

        // Assert the badge has the correct alt
        expect(badge.attributes('alt')).toBe(mockBadgeAlt)

        // Assert the badge has the correct title
        expect(badge.attributes('title')).toBe(mockBadgeTitle)
      }
    })
  })
})
