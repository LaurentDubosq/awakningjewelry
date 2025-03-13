import { mount, RouterLinkStub } from '@vue/test-utils'
import CollectionListingItem from '@/components/CollectionListingItem.vue'
import frontDataBase from '../../../db.json'

/********************/
/* 1.Initialization */
/********************/

const mockCollection = frontDataBase.collectionsByGender[0]
const mockCollectionURL = mockCollection.url
const mockCollectionImageURL = mockCollection.image.url
const mockCollectionTitle = mockCollection.title

/***********/
/* 2.Build */
/***********/

// Component Factory
function mountCollectionListingItem() {
  return mount(CollectionListingItem, {
    props: {
      collection: mockCollection,
    },
    global: {
      stubs: { RouterLink: RouterLinkStub },
    },
  })
}

/**********/
/* 3.Test */
/**********/

describe('CollectionListingItem.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mountCollectionListingItem()
  })

  // Smoke test
  test('mounts successfully', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  test('renders collection with necessary information', () => {
    const link = wrapper.findComponent(RouterLinkStub)
    const img = wrapper.find("[data-testid='collection-listing__item-img']")
    const title = wrapper.find("[data-testid='collection-listing__item-title']")

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
