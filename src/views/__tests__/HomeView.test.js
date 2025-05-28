import { mount, RouterLinkStub } from '@vue/test-utils'
import HomeView from '@/views/HomeView.vue'
import Hero from '@/components/Hero.vue'
import NewsletterSignup from '@/components/NewsletterSignup.vue'
import StatementBanner from '@/components/StatementBanner.vue'
import CollectionListing from '@/components/CollectionListing.vue'
import ProductListing from '@/components/ProductListing.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import frontDataBase from '../../../db.json'
import { defineStore } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import { computed, nextTick, ref } from 'vue'

/********************/
/* 1.Initialization */
/********************/

/* Data */

const mockStatementPending = {
  statement: undefined,
  fetchStatus: 'pending',
}
const mockStatementRejected = {
  statement: undefined,
  fetchStatus: 'rejected',
}
const mockStatementResolved = {
  statement: frontDataBase.statementMission,
  fetchStatus: 'resolved',
}
const mockStatement = mockStatementResolved.statement
const mockStatementTitle = mockStatement.title
const mockStatementText = mockStatement.text
const mockStatementImageURL = mockStatement.image.url
const mockStatementImageAlt = mockStatement.image.alt

const mockCollectionsTitle = 'By Gender'
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

const mockProductsTitle = 'Promotions'
const mockProductsPending = {
  products: undefined,
  fetchStatus: 'pending',
}
const mockProductsRejected = {
  products: undefined,
  fetchStatus: 'rejected',
}
const mockProductsResolved = {
  products: frontDataBase.promotions,
  fetchStatus: 'resolved',
}
const mockProducts = mockProductsResolved.products
const mockProductsLength = mockProducts.length

/* Stores */

// Initialize a testing pinia instance
const mockPinia = createTestingPinia({ stubActions: false })

// Create the stores
const mockUseStatementMissionResultStore = defineStore('StatementMissionResult', () => {
  const statementMissionResult = ref(mockStatementPending)
  const statementMissionData = computed(() => statementMissionResult.value.statement)
  const statementMissionFetchStatus = computed(() => statementMissionResult.value.fetchStatus)
  const updateStatementMissionResult = (newState) => {
    statementMissionResult.value = newState
  }
  return {
    statementMissionResult,
    statementMissionData,
    statementMissionFetchStatus,
    updateStatementMissionResult,
  }
})

const mockUseCollectionsByGenderResultStore = defineStore('CollectionsByGenderResult', () => {
  const collectionsByGenderResult = ref(mockCollectionsPending)
  const collectionsByGenderData = computed(() => collectionsByGenderResult.value.collections)
  const collectionsByGenderFetchStatus = computed(() => collectionsByGenderResult.value.fetchStatus)
  const updateCollectionsByGenderResult = (newState) => {
    collectionsByGenderResult.value = newState
  }
  return {
    collectionsByGenderResult,
    collectionsByGenderData,
    collectionsByGenderFetchStatus,
    updateCollectionsByGenderResult,
  }
})

const mockUsePromotionsResultStore = defineStore('PromotionsResult', () => {
  const promotionsResult = ref(mockProductsPending)
  const promotionsResultData = computed(() => promotionsResult.value.products)
  const promotionsResultFetchStatus = computed(() => promotionsResult.value.fetchStatus)
  const updatePromotionsResult = (newState) => {
    promotionsResult.value = newState
  }
  return {
    promotionsResult,
    promotionsResultData,
    promotionsResultFetchStatus,
    updatePromotionsResult,
  }
})

// Initialize the stores
const mockStatementMissionResultStore = mockUseStatementMissionResultStore()
const mockCollectionsByGenderResultStore = mockUseCollectionsByGenderResultStore()
const mockPromotionsResultStore = mockUsePromotionsResultStore()

/***********/
/* 2.Build */
/***********/

// Component Factory (Data fetching "Pending" state)
function mountHomeview() {
  return mount(HomeView, {
    global: {
      stubs: {
        Hero: true,
        RouterLink: RouterLinkStub,
      },
      plugins: [mockPinia],
    },
  })
}

/**********/
/* 3.Test */
/**********/

// WARNING : The component has 3 states regarding the data fetching status for all child components. "Pending", "Rejected" and "Resolved". The state by default is "Pending".

describe('HomeView.vue', () => {
  let wrapper

  beforeEach(async () => {
    // Component mounting (Data fetching "Pending" state)
    wrapper = mountHomeview()
  })

  afterEach(() => {
    // Reset the store(s) state(s) to default to ensure a clean environment for each test
    mockStatementMissionResultStore.statementMissionResult = mockStatementPending
    mockCollectionsByGenderResultStore.collectionsByGenderResult = mockCollectionsPending
    mockPromotionsResultStore.promotionsResult = mockProductsPending
  })

  // Smoke test
  test('mounts successfully', async () => {
    // Assert the wrapper component is well mounted at initial render
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('Initial render - Data fetching "Pending" state', () => {
    test('hero feature is rendered', async () => {
      const HeroComponent = wrapper.findComponent(Hero)
      expect(HeroComponent.exists()).toBeTruthy()
    })

    test('renders the collection listing title', () => {
      const title = wrapper.find("[data-testid='collection-listing__title']")
      expect(title.text()).toContain(mockCollectionsTitle)
    })

    test('renders the product listing title', () => {
      const title = wrapper.find("[data-testid='product-listing__title']")
      expect(title.text()).toContain(mockProductsTitle)
    })

    test('newsletter signup feature is rendered', async () => {
      const NewsletterSignupComponent = wrapper.findComponent(NewsletterSignup)
      expect(NewsletterSignupComponent.exists()).toBeTruthy()
    })

    test('the loaders are rendered', async () => {
      // Statement Banner
      const StatementBannerComponent = wrapper.findComponent(StatementBanner)
      const StatementBannerLoadingComponent =
        StatementBannerComponent.findComponent(LoadingComponent)
      expect(StatementBannerLoadingComponent.exists()).toBeTruthy()

      // Collection Listing
      const CollectionListingComponent = wrapper.findComponent(CollectionListing)
      const CollectionListingLoadingComponent =
        CollectionListingComponent.findComponent(LoadingComponent)
      expect(CollectionListingLoadingComponent.exists()).toBeTruthy()

      // Product Listing
      const ProductListingComponent = wrapper.findComponent(ProductListing)
      const ProductListingLoadingComponent = ProductListingComponent.findComponent(LoadingComponent)
      expect(ProductListingLoadingComponent.exists()).toBeTruthy()
    })
  })

  describe('Data fetching "Rejected" state', () => {
    test('the error messages are rendered', async () => {
      // Set the stores data fetching status to rejected
      mockStatementMissionResultStore.statementMissionResult = mockStatementRejected
      mockCollectionsByGenderResultStore.collectionsByGenderResult = mockCollectionsRejected
      mockPromotionsResultStore.promotionsResult = mockProductsRejected
      await nextTick()

      // Statement Banner
      const StatementBannerComponent = wrapper.findComponent(StatementBanner)
      const StatementBannerErrorComponent = StatementBannerComponent.findComponent(ErrorComponent)
      expect(StatementBannerErrorComponent.exists()).toBeTruthy()

      // Collection Listing
      const CollectionListingComponent = wrapper.findComponent(CollectionListing)
      const CollectionListingErrorComponent =
        CollectionListingComponent.findComponent(ErrorComponent)
      expect(CollectionListingErrorComponent.exists()).toBeTruthy()

      // Product Listing
      const ProductListingComponent = wrapper.findComponent(ProductListing)
      const ProductListingErrorComponent = ProductListingComponent.findComponent(ErrorComponent)
      expect(ProductListingErrorComponent.exists()).toBeTruthy()
    })
  })

  describe('Data fetching "Resolved" state', () => {
    beforeEach(async () => {
      // Set the stores data fetching status to resolved
      mockStatementMissionResultStore.statementMissionResult = mockStatementResolved
      mockCollectionsByGenderResultStore.collectionsByGenderResult = mockCollectionsResolved
      mockPromotionsResultStore.promotionsResult = mockProductsResolved
      await nextTick()
    })

    test('statement mission is rendered with its necessary information', () => {
      // Find the elements
      const StatementBannerComponent = wrapper.findComponent(StatementBanner)
      const title = StatementBannerComponent.find("[data-testid='statement-banner__title']")
      const text = StatementBannerComponent.find("[data-testid='statement-banner__text']")
      const image = StatementBannerComponent.find("[data-testid='statement-banner__image']")

      // Assert its title is rendered
      expect(title.text()).toContain(mockStatementTitle)

      // Assert its text is rendered
      expect(text.text()).toContain(mockStatementText)

      // Assert the image is rendered
      expect(image.exists()).toBeTruthy()

      // Assert the image "src" attribute is well setted
      expect(image.attributes('src')).toBe(mockStatementImageURL)

      // Assert the image "alt" attribute is well setted
      expect(image.attributes('alt')).toBe(mockStatementImageAlt)
    })

    test('collections are rendered with their necessary information', () => {
      // Find the elements
      const CollectionListingComponent = wrapper.findComponent(CollectionListing)
      const collections = CollectionListingComponent.findAll(
        "[data-testid='collection-listing__item']",
      )

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

    test('products are rendered with their necessary information', () => {
      // Find the elements
      const ProductListingComponent = wrapper.findComponent(ProductListing)

      // Find the products elements
      const products = ProductListingComponent.findAll("[data-testid='product-listing__item']")

      // Assert all the products are rendered
      expect(products).toHaveLength(mockProductsLength)

      // Assert any product is rendered with necessary information
      products.forEach((product, index) => {
        const link = product.findComponent(RouterLinkStub)
        const image = product.find("[data-testid='product-listing__item-image']")
        const title = product.find("[data-testid='product-listing__item-title']")
        const originalPrice = product.find("[ data-testid='product-listing__item-original-price']")
        const discountedPrice = product.find(
          "[ data-testid='product-listing__item-discounted-price']",
        )
        const mockProduct = mockProducts[index]
        const mockProductURL = mockProduct.url
        const mockProductImageURL = mockProduct.image.url
        const mockProductImageALT = mockProduct.image.alt
        const mockProductTitle = mockProduct.title
        const mockProductOriginalPrice = mockProduct.price
        const mockProductDiscountedPrice = mockProduct.promotionalPrice

        // Assert the product has a link
        expect(link.exists()).toBeTruthy()

        // Assert the link has the correct "url" value
        expect(link.props('to')).toBe(mockProductURL)

        // Assert its image is rendered
        expect(image.exists()).toBeTruthy()

        // Assert its image has the correct "src" value
        expect(image.attributes('src')).toBe(mockProductImageURL)

        // Assert its image has the correct "alt" value
        expect(image.attributes('alt')).toBe(mockProductImageALT)

        // Assert its title is rendered
        expect(title.text()).toContain(mockProductTitle)

        // Assert its original price is rendered
        expect(originalPrice.text()).toContain(mockProductOriginalPrice)

        // Assert its discounted price is rendered
        expect(discountedPrice.text()).toContain(mockProductDiscountedPrice)
      })
    })
  })
})
