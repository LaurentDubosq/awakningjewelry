import { mount, RouterLinkStub } from '@vue/test-utils'
import SiteNavDropdownList from '@/components/SiteNavDropdownList.vue'
import SiteNavDropdownItem from '@/components/SiteNavDropdownItem.vue'
import { closeSiteNavDropdownKey } from '@/utils/injectionkeys'
import frontDataBase from '../../../db.json'

/********************/
/* 1.Initialization */
/********************/

const mockSiteMenu = frontDataBase['siteMenu']
const mockDropdownText = mockSiteMenu[1].text
const mockLinks = mockSiteMenu[1].subMenu
const mockCloseSiteNavDropdown = vi.fn()

/***********/
/* 2.Build */
/***********/

// Component Factory
function mountSiteNavDropdownList() {
  return mount(SiteNavDropdownList, {
    props: { links: mockLinks, dropdownText: mockDropdownText },
    global: {
      provide: { [closeSiteNavDropdownKey]: mockCloseSiteNavDropdown },
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
    wrapper = mountSiteNavDropdownList()
  })

  // Smoke test
  test('mounts successfully', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  test('renders all its expected items with necessary information', () => {
    const itemComponents = wrapper.findAllComponents(SiteNavDropdownItem)

    // Assert that all the expected items' component are rendered
    expect(itemComponents).toHaveLength(mockLinks.length)

    // Assert that each item component has its data well setted as prop
    itemComponents.forEach((itemComponent, index) => {
      const mockLink = mockLinks[index]
      // Assert that the 'link' prop has the correct value
      expect(itemComponent.props('link')).toMatchObject(mockLink)
    })
  })
})
