import { mount } from '@vue/test-utils'
import BurgerMenuDropdownList from '@/components/BurgerMenuDropdownList.vue'
import BurgerMenuDropdownItem from '@/components/BurgerMenuDropdownItem.vue'
import router from '@/router'
import { toggleBurgerMenuKey } from '@/utils/injectionkeys'
import frontDataBase from '../../../db.json'

const mockSiteMenu = frontDataBase['siteMenu']
const mockDropdownText = mockSiteMenu[1].text
const mockLinks = mockSiteMenu[1].subMenu
const mockLinksLength = mockLinks.length

// Mock the fetcher used in the mocked router
vi.mock('@/data/dataFetchers', () => {
  return {
    getPagesMetaData: vi.fn().mockReturnValue(undefined),
  }
})

// Component Factory
function mountBurgerMenuDropdownList() {
  return mount(BurgerMenuDropdownList, {
    props: { links: mockLinks, dropdownText: mockDropdownText },
    global: {
      stubs: { BurgerMenuDropdownItem: true },
      plugins: [router],
      provide: { [toggleBurgerMenuKey]: vi.fn() },
    },
  })
}

describe('BurgerMenuDropdownList.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mountBurgerMenuDropdownList()
  })

  // Smoke test
  test('mounts successfully', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  test('renders all its expected items with necessary information', () => {
    const itemComponents = wrapper.findAllComponents(BurgerMenuDropdownItem)

    // Assert all the expected item's component are rendered
    expect(itemComponents).toHaveLength(mockLinksLength)

    // Assert that each item component has its data well setted as prop
    itemComponents.forEach((itemComponent, index) => {
      const mockLink = mockLinks[index]
      // Assert the 'link' prop has the correct value
      expect(itemComponent.props('link')).toMatchObject(mockLink)
    })
  })
})
