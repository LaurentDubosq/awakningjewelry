import { mount } from '@vue/test-utils'
import SiteHeaderIcon from '@/components/SiteHeaderIcon.vue'
import IconPerson from '@/components/icons/IconPerson.vue'
import frontDataBase from '../../../db.json'

const mockSiteMenu = frontDataBase['siteMenu']
const mockLink = mockSiteMenu[4]
const mockLinkAlternativeText = mockLink.text

// Component Factory
function mountSiteHeaderIcon(options = {}) {
  return mount(SiteHeaderIcon, {
    props: { alternativeText: mockLinkAlternativeText },
    ...options,
  })
}

describe('SiteHeaderIcon Component:', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mountSiteHeaderIcon()
  })

  // Smoke test
  test('mounts successfully', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  test('renders the icon with necessary information', () => {
    wrapper = mountSiteHeaderIcon({
      slots: { default: IconPerson },
    })
    const alternativeText = wrapper.find("[data-testid='site-header__icon-text']")
    const icon = wrapper.find("[data-testid='icon-person']") // we target the icon instead of component because we decided to not have tests for SVG components

    // Assert the alternative text is rendered
    expect(alternativeText.text()).toContain(mockLinkAlternativeText)

    // Assert the icon is rendered
    expect(icon.exists()).toBeTruthy()
  })
})
