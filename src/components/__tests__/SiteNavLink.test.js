import { mount } from '@vue/test-utils'
import router from '@/router'
import SiteNavLink from '@/components/SiteNavLink.vue'
import SiteHeaderIcon from '@/components/SiteHeaderIcon.vue'
import IconPerson from '@/components/icons/IconPerson.vue'
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
const mockLinkTypeText = mockSiteMenu[0]
const mockLinkTypeIcon = mockSiteMenu[4]

/***********/
/* 3.Build */
/***********/

// Component Factory
function mountSiteNavLink(options) {
  return mount(SiteNavLink, {
    props: { link: mockLinkTypeText },
    global: {
      plugins: [router],
    },
    ...options,
  })
}

/**********/
/* 4.Test */
/**********/

describe('SiteNavLink.vue', () => {
  // Smoke test
  test('mounts successfully', () => {
    // Assert the testing environement is ready for text variant
    const wrapperTypeText = mountSiteNavLink()
    expect(wrapperTypeText.exists()).toBeTruthy()

    // Assert the testing environement is ready for icon variant
    const wrapperTypeIcon = mountSiteNavLink({
      props: { link: mockLinkTypeIcon },
    })
    expect(wrapperTypeIcon.exists()).toBeTruthy()
  })

  describe('Text variant', () => {
    const mockLinkText = mockLinkTypeText.text
    const mockLinkURL = mockLinkTypeText.url

    test('renders the link with necessary information', () => {
      const wrapper = mountSiteNavLink()
      const link = wrapper.find("[data-testid='site-nav__link--text']")

      // Assert the link exists
      expect(link.exists()).toBeTruthy()

      // Assert the link has the correct url
      expect(link.attributes('href')).toBe(mockLinkURL)

      // Assert the link text is rendered
      expect(link.text()).toContain(mockLinkText)
    })
  })

  describe('Icon variant', () => {
    const mockLinkText = mockLinkTypeIcon.text
    const mockLinkURL = mockLinkTypeIcon.url

    test('renders the link with necessary information', () => {
      const wrapper = mountSiteNavLink({
        props: { link: mockLinkTypeIcon },
        slots: { default: IconPerson },
      })
      const SiteHeaderIconComponent = wrapper.findComponent(SiteHeaderIcon)
      const link = wrapper.find("[data-testid='site-nav__link--icon']")
      const icon = wrapper.find("[data-testid='icon-person']") // we target the icon instead of component because we decided to not have tests for SVG components

      // Assert the link exists
      expect(link.exists()).toBeTruthy()

      // Assert the link has the correct url
      expect(link.attributes('href')).toBe(mockLinkURL)

      // Assert the icon sent by slot is rendered
      expect(icon.exists()).toBeTruthy()

      // Assert the alternative text prop value is well setted
      expect(SiteHeaderIconComponent.props('alternativeText')).toBe(mockLinkText)
    })
  })
})
