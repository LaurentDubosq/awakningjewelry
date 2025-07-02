import { mount, RouterLinkStub } from '@vue/test-utils'
import CollectionListing from '@/components/CollectionListing.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import frontDataBase from '../../../db.json'

/********************/
/* 1.Initialization */
/********************/

const mockContentPending = {
  content: undefined,
  contentFetchState: 'pending',
}
const mockContentRejected = {
  content: undefined,
  contentFetchState: 'rejected',
}
const mockContentFulfilled = {
  content: frontDataBase.byGenderCollectionListingContent,
  contentFetchState: 'fulfilled',
}
const mockContent = mockContentFulfilled.content
const mockContentTitle = mockContent.title
const mockContentFeatureLabel = `Collections ${mockContentTitle}`
const mockContentCollections = mockContent.collections
const mockContentCollectionsLength = mockContentCollections.length

/***********/
/* 2.Build */
/***********/

// Component Factory (Data fetching "Pending" state)
function mountCollectionListing(props) {
  return mount(CollectionListing, {
    props: {
      content: mockContentPending.content,
      contentFetchState: mockContentPending.contentFetchState,
      ...props,
    },
    global: { stubs: { RouterLink: RouterLinkStub } },
  })
}

/**********/
/* 3.Test */
/**********/

// WARNING : The component has 3 states regarding the data fetching state. "Pending", "Rejected" and "Fulfilled". The state by default is "Pending".

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
    test('the loader animation is rendered', async () => {
      const loadingComponent = wrapper.findComponent(LoadingComponent)
      expect(loadingComponent.exists()).toBeTruthy()
    })
  })

  describe('Data fetching "Rejected" state', () => {
    test('the error message is rendered', () => {
      // Mount the component (rejected state)
      const wrapper = mountCollectionListing(mockContentRejected)

      // Assert the error message is rendered
      const errorComponent = wrapper.findComponent(ErrorComponent)
      expect(errorComponent.exists()).toBeTruthy()
    })
  })

  describe('Data fetching "Fulfilled" state', () => {
    beforeEach(() => {
      // Mount the component (fulfilled state)
      wrapper = mountCollectionListing(mockContentFulfilled)
    })

    test('renders the feature label for accessibility', () => {
      const section = wrapper.find("[data-testid='collection-listing']")
      expect(section.attributes('aria-label')).toBe(mockContentFeatureLabel)
    })

    test('renders its title', () => {
      const title = wrapper.find("[data-testid='collection-listing__title']")
      expect(title.text()).toContain(mockContentTitle)
    })

    test("don't renders the title for screen readers", () => {
      const title = wrapper.find("[data-testid='collection-listing__title']")
      expect(title.attributes('aria-hidden')).toBe('true')
    })

    test('renders all collections with necessary information', () => {
      // Find the collections elements
      const collections = wrapper.findAll("[data-testid='collection-listing__item']")

      // Assert that all collections are rendered
      expect(collections).toHaveLength(mockContentCollectionsLength)

      // Assert any collection is rendered with necessary information
      collections.forEach((collection, index) => {
        const link = collection.findComponent(RouterLinkStub)
        const img = collection.find("[data-testid='collection-listing__item-img']")
        const title = collection.find("[data-testid='collection-listing__item-title']")
        const mockCollection = mockContentCollections[index]
        const mockCollectionURL = mockCollection.url
        const mockCollectionImageURL = mockCollection.image.url
        const mockCollectionTitle = mockCollection.title

        // Assert the collection has a link
        expect(link.exists()).toBeTruthy()

        // Assert the link has the correct "url" value
        expect(link.props('to')).toBe(mockCollectionURL)

        // Assert the link has the correct "title" value
        expect(link.attributes('title')).toBe(`Explore ${mockCollectionTitle} collection`)

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
