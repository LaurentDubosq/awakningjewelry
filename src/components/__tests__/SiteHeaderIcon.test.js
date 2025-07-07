import { mount } from '@vue/test-utils'
import SiteHeaderIcon from '@/components/SiteHeaderIcon.vue'
import IconPerson from '@/components/icons/IconPerson.vue'
import frontDataBase from '../../../db.json'

/********************/
/* 1.Initialization */
/********************/

const mockSiteMenu = frontDataBase['siteMenu']
const mockLink = mockSiteMenu[4] // object corresponding to "My Account" link
const mockLinkAlternativeText = mockLink.text

/***********/
/* 2.Build */
/***********/

// Component Factory (Utility component)
const mountSiteHeaderIcon = () => {
  return mount(SiteHeaderIcon, {
    props: { alternativeText: mockLinkAlternativeText },
    slots: { default: IconPerson },
  })
}

/**********/
/* 3.Test */
/**********/

describe('SiteHeaderIcon Component:', () => {
  let wrapper

  beforeEach(() => {
    // Component Factory (Utility component)
    wrapper = mountSiteHeaderIcon()
  })

  // Smoke test
  test('mounts successfully', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  test('renders the icon with necessary information', () => {
    // Assert the icon is rendered
    const icon = wrapper.find("[data-testid='icon-person']")
    expect(icon.exists()).toBeTruthy()

    // Assert the alternative text is rendered
    const alternativeText = wrapper.find("[data-testid='site-header__icon-text']")
    expect(alternativeText.text()).toContain(mockLinkAlternativeText)
  })
})
