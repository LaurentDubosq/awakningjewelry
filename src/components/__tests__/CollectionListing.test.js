import { mount, RouterLinkStub } from '@vue/test-utils'
import CollectionListing from '@/components/CollectionListing.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import frontDataBase from '../../../db.json'

/********************/
/* 1.Initialization */
/********************/

const mockTitle = 'By gender'
const mockCollectionsPending = {
  collections: undefined,
  fetchStatus: 'pending',
}
const mockCollectionsRejected = {
  collections: undefined,
  fetchStatus: 'rejected',
}
const mockCollectionsResolved = {
  collections: frontDataBase.collectionsByGender,
  fetchStatus: 'resolved',
}
const mockCollections = mockCollectionsResolved.collections
const mockCollectionsLength = mockCollections.length

/***********/
/* 2.Build */
/***********/

// Component Factory (Data fetching "Pending" state)
function mountCollectionListing(props) {
  return mount(CollectionListing, {
    props: {
      title: mockTitle,
      collections: mockCollectionsPending.collections,
      fetchStatus: mockCollectionsPending.fetchStatus,
      ...props,
    },
    global: { stubs: { RouterLink: RouterLinkStub } },
  })
}

/**********/
/* 3.Test */
/**********/

// WARNING : The component has 3 states regarding the data fetching status. "Pending", "Rejected" and "Resolved". The state by default is "Pending".

describe('CollectionListing.vue', () => {
  let wrapper

  beforeEach(() => {
    // Component mounting (Data fetching "Pending" state)
    wrapper = mountCollectionListing()
  })

  // Smoke test
  test('mounts successfully', async () => {
    // Assert the wrapper component is well mounted at initial render
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('Initial render - Data fetching "Pending" state', () => {
    test('renders its title', () => {
      const title = wrapper.find("[data-testid='collection-listing__title']")
      expect(title.text()).toContain(mockTitle)
    })

    test('the loader animation is rendered', async () => {
      const loadingComponent = wrapper.findComponent(LoadingComponent)
      expect(loadingComponent.exists()).toBeTruthy()
    })
  })

  describe('Data fetching "Rejected" state', () => {
    test('the error message is rendered', () => {
      // Mount the component (rejected state)
      const wrapper = mountCollectionListing(mockCollectionsRejected)

      // Assert the error message is rendered
      const errorComponent = wrapper.findComponent(ErrorComponent)
      expect(errorComponent.exists()).toBeTruthy()
    })
  })

  describe('Data fetching "Resolved" state', () => {
    test('renders all collections with necessary information', () => {
      // Mount the component (resolved state)
      const wrapper = mountCollectionListing(mockCollectionsResolved)

      // Find the collections elements
      const collections = wrapper.findAll("[data-testid='collection-listing__item']")

      // Assert that all collections are rendered
      expect(collections).toHaveLength(mockCollectionsLength)

      // Assert any collection is rendered with necessary information
      collections.forEach((collection, index) => {
        const link = collection.findComponent(RouterLinkStub)
        const img = collection.find("[data-testid='collection-listing__item-img']")
        const title = collection.find("[data-testid='collection-listing__item-title']")
        const mockCollection = mockCollections[index]
        const mockCollectionURL = mockCollection.url
        const mockCollectionImageURL = mockCollection.image.url
        const mockCollectionTitle = mockCollection.title

        // Assert the collection has a link
        expect(link.exists()).toBeTruthy()

        // Assert the link has the correct "url" value
        expect(link.props('to')).toBe(mockCollectionURL)

        // Assert its img is rendered
        expect(img.exists()).toBeTruthy()

        // Assert its image has the correct "src" value
        expect(img.attributes('src')).toBe(mockCollectionImageURL)

        // Assert its image has its "alt" attribut empty
        expect(img.attributes('alt')).toBe('')

        // Assert its title is rendered
        expect(title.text()).toContain(mockCollectionTitle)
      })
    })
  })
})
