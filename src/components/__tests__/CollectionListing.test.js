import { mount, RouterLinkStub } from '@vue/test-utils'
import CollectionListing from '@/components/CollectionListing.vue'
import CollectionListingItem from '@/components/CollectionListingItem.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import frontDatabase from '../../../db.json'

/********************/
/* 1.Initialization */
/********************/

const mockCollectionsResult = {
  data: frontDatabase.collectionsByGender,
  status: 'resolved',
}
const mockCollectionsData = mockCollectionsResult.data
const mockCollectionsStatus = mockCollectionsResult.status
const mockCollectionsLength = mockCollectionsData.length
const mockTitle = 'By gender'

/***********/
/* 2.Build */
/***********/

// Component Factory
function mountCollectionListing(props) {
  return mount(CollectionListing, {
    props: {
      title: mockTitle,
      collections: mockCollectionsData,
      fetchStatus: mockCollectionsStatus,
      ...props,
    },
    global: { stubs: { RouterLink: RouterLinkStub } },
  })
}

/**********/
/* 3.Test */
/**********/

describe('CollectionListing.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mountCollectionListing()
  })

  // Smoke test
  test('mounts successfully', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  test('renders its title', () => {
    const title = wrapper.find("[data-testid='collection-listing__title']")
    expect(title.text()).toContain(mockTitle)
  })

  test('renders all collections with necessary information', () => {
    const CollectionListingItemComponents = wrapper.findAllComponents(CollectionListingItem)

    // Assert that all collections are rendered
    expect(CollectionListingItemComponents).toHaveLength(mockCollectionsLength)

    // Assert any collection is rendered with necessary information
    CollectionListingItemComponents.forEach((CollectionListingItemComponent, index) => {
      const mockCollection = mockCollectionsData[index]

      // Assert the CollectionListingItemComponent has its "collection" prop value well setted
      expect(CollectionListingItemComponent.props('collection')).toMatchObject(mockCollection)
    })
  })

  describe('Behaviors:', () => {
    test("when the data fetcher status is 'pending', the loading component is rendered", () => {
      // Remount the component with pending status active
      wrapper = mountCollectionListing({ fetchStatus: 'pending' })

      // Assert the loading component is rendered
      const loadingComponent = wrapper.findComponent(LoadingComponent)
      expect(loadingComponent.exists()).toBeTruthy()
    })

    test("when the data fetcher status is 'resolved', its data is rendered", () => {
      // Assert that one of its pieces of data is rendered
      const CollectionListingItemComponent = wrapper.findComponent(CollectionListingItem)
      expect(CollectionListingItemComponent.exists()).toBeTruthy()
    })

    test("when the data fetcher status is 'rejected', the error component is rendered", () => {
      // Remount the component with rejected status active
      wrapper = mountCollectionListing({ fetchStatus: 'rejected' })

      // Assert the error component is rendered
      const errorComponent = wrapper.findComponent(ErrorComponent)
      expect(errorComponent.exists()).toBeTruthy()
    })
  })
})
