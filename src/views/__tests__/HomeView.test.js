import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import HomeView from '@/views/HomeView.vue'
import Hero from '@/components/Hero.vue'
import StatementBanner from '@/components/StatementBanner.vue'
import CollectionListing from '@/components/CollectionListing.vue'
import CollectionListingItem from '@/components/CollectionListingItem.vue'
import ProductListing from '@/components/ProductListing.vue'
import ProductListingItem from '@/components/ProductListingItem.vue'
import frontDataBase from '../../../db.json'
import { defineStore } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import { computed, ref } from 'vue'

/********************/
/* 1.Initialization */
/********************/

/* Data */

const mockStatementBannerResult = {
  data: frontDataBase.statementMission,
  status: 'resolved',
}
const mockStatementBannerData = mockStatementBannerResult.data
const mockStatementBannerStatus = mockStatementBannerResult.status
const mockCollectionsByGenderResult = {
  data: frontDataBase.collectionsByGender,
  status: 'resolved',
}
const mockCollectionsByGenderData = mockCollectionsByGenderResult.data
const mockCollectionsByGenderStatus = mockCollectionsByGenderResult.status
const mockPromotionsResult = {
  data: frontDataBase.promotions,
  status: 'resolved',
}
const mockPromotionsData = mockPromotionsResult.data
const mockPromotionsStatus = mockPromotionsResult.status

/* Stores */

// Initialize a testing pinia instance
const mockPinia = createTestingPinia({ stubActions: false })

// Create the stores
const mockUseStatementMissionResultStore = defineStore('StatementMissionResult', () => {
  const statementMissionResult = ref(mockStatementBannerResult)
  const statementMissionData = computed(() => statementMissionResult.value.data)
  const statementMissionFetchStatus = computed(() => statementMissionResult.value.status)
  const updateStatementMissionResult = (newStatementMissionResult) => {
    statementMissionResult.value = newStatementMissionResult
  }
  return {
    statementMissionResult,
    statementMissionData,
    statementMissionFetchStatus,
    updateStatementMissionResult,
  }
})

const mockUseCollectionsByGenderResultStore = defineStore('CollectionsByGenderResult', () => {
  const collectionsByGenderResult = ref(mockCollectionsByGenderResult)
  const collectionsByGenderData = computed(() => collectionsByGenderResult.value.data)
  const collectionsByGenderFetchStatus = computed(() => collectionsByGenderResult.value.status)
  const updateCollectionsByGenderResult = (newCollectionsByGenderResult) => {
    collectionsByGenderResult.value = newCollectionsByGenderResult
  }
  return {
    collectionsByGenderResult,
    collectionsByGenderData,
    collectionsByGenderFetchStatus,
    updateCollectionsByGenderResult,
  }
})

const mockUsePromotionsResultStore = defineStore('PromotionsResult', () => {
  const promotionsResult = ref(mockPromotionsResult)
  const promotionsResultData = computed(() => promotionsResult.value.data)
  const promotionsResultFetchStatus = computed(() => promotionsResult.value.status)
  const updatePromotionsResult = (newPromotionsResult) => {
    promotionsResult.value = newPromotionsResult
  }
  return {
    promotionsResult,
    promotionsResultData,
    promotionsResultFetchStatus,
    updatePromotionsResult,
  }
})

// Initialize the stores
mockUseStatementMissionResultStore()
mockUseCollectionsByGenderResultStore()
mockUsePromotionsResultStore()

/***********/
/* 2.Build */
/***********/

// Component Factory
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

describe('HomeView.vue', () => {
  let wrapper

  beforeEach(async () => {
    wrapper = mountHomeview()
  })

  // Smoke test
  test('mounts successfully', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('Hero.vue', () => {
    test('is rendered', async () => {
      // Wait after the Hero.vue async import has been resolved
      await flushPromises()

      // Assert the Hero component is rendered
      const HeroComponent = wrapper.findComponent(Hero)
      expect(HeroComponent.exists()).toBeTruthy()
    })
  })

  describe('StatementBanner.vue', () => {
    let StatementBannerComponent
    const mockStatement = mockStatementBannerData
    const mockStatementTitle = mockStatement.title
    const mockStatementText = mockStatement.text
    const mockStatementImageURL = mockStatement.image.url
    const mockStatementImageAlt = mockStatement.image.alt

    beforeEach(() => {
      StatementBannerComponent = wrapper.findComponent(StatementBanner)
    })

    test('is rendered with necessary information', () => {
      // Assert the component is rendered
      expect(StatementBannerComponent.exists()).toBeTruthy()

      // Assert its "statement" prop has the correct value
      expect(StatementBannerComponent.props('statement')).toMatchObject(mockStatementBannerData)

      // Assert its "fetchStatus" prop has the correct value
      expect(StatementBannerComponent.props('fetchStatus')).toMatchObject(mockStatementBannerStatus)
    })

    test('renders its data', () => {
      const title = StatementBannerComponent.find("[data-testid='statement-banner__title']")
      const text = StatementBannerComponent.find("[data-testid='statement-banner__text']")
      const image = StatementBannerComponent.find("[data-testid='statement-banner__image']")

      // Assert its title is rendered
      expect(title.text()).toContain(mockStatementTitle)

      // Assert its text is rendered
      expect(text.text()).toContain(mockStatementText)

      // Assert the image "src" attribute has the correct value
      expect(image.attributes('src')).toBe(mockStatementImageURL)

      // Assert the image "alt" attribute has the correct value
      expect(image.attributes('alt')).toBe(mockStatementImageAlt)
    })
  })

  describe('CollectionListing.vue', () => {
    let CollectionListingComponent
    const mockTitle = 'By Gender'
    const mockCollections = mockCollectionsByGenderData
    const mockCollectionsLength = mockCollections.length

    beforeEach(() => {
      CollectionListingComponent = wrapper.findComponent(CollectionListing)
    })

    test('is rendered with necessary information', () => {
      // Assert the component is rendered
      expect(CollectionListingComponent.exists()).toBeTruthy()

      // Assert its "title" prop value has the correct value
      expect(CollectionListingComponent.props('title')).toBe(mockTitle)

      // Assert its "collections" prop value has the correct value
      expect(CollectionListingComponent.props('collections')).toMatchObject(
        mockCollectionsByGenderData,
      )

      // Assert its "fetchStatus" prop value has the correct value
      expect(CollectionListingComponent.props('fetchStatus')).toMatchObject(
        mockCollectionsByGenderStatus,
      )
    })

    test('renders its data', () => {
      /*************************/
      /* CollectionListing.vue */
      /*************************/

      const title = CollectionListingComponent.find("[data-testid='collection-listing__title']")
      const CollectionListingItemComponents =
        CollectionListingComponent.findAllComponents(CollectionListingItem)

      // Assert the title is rendered
      expect(title.text()).toContain(mockTitle)

      // Assert all the CollectionListingItem component has been rendered
      expect(CollectionListingItemComponents).toHaveLength(mockCollectionsLength)

      /*****************************/
      /* CollectionListingItem.vue */
      /*****************************/

      // Assert any collection data is rendered
      CollectionListingItemComponents.forEach((CollectionListingItemComponent, index) => {
        const link = CollectionListingItemComponent.findComponent(RouterLinkStub)
        const img = CollectionListingItemComponent.find(
          "[data-testid='collection-listing__item-img']",
        )
        const title = CollectionListingItemComponent.find(
          "[data-testid='collection-listing__item-title']",
        )
        const mockCollection = mockCollections[index]
        const mockCollectionURL = mockCollection.url
        const mockCollectionImageURL = mockCollection.image.url
        const mockCollectionTitle = mockCollection.title

        // Assert the link has the correct url
        expect(link.props('to')).toBe(mockCollectionURL)

        // Assert its image has the correct "src" value
        expect(img.attributes('src')).toBe(mockCollectionImageURL)

        // Assert its title is rendered
        expect(title.text()).toContain(mockCollectionTitle)
      })
    })
  })

  describe('ProductListing.vue', () => {
    let ProductListingComponent
    const mockTitle = 'Promotions'
    const mockPromotions = mockPromotionsData
    const mockPromotionsLength = mockPromotions.length

    beforeEach(() => {
      ProductListingComponent = wrapper.findComponent(ProductListing)
    })

    test('is rendered with necessary information', () => {
      // Assert the component is rendered
      expect(ProductListingComponent.exists()).toBeTruthy()

      // Assert its "title" prop has the correct value
      expect(ProductListingComponent.props('title')).toBe(mockTitle)

      // Assert its "products" prop has the correct value
      expect(ProductListingComponent.props('products')).toMatchObject(mockPromotions)

      // Assert its "fetchStatus" prop has the correct value
      expect(ProductListingComponent.props('fetchStatus')).toMatchObject(mockPromotionsStatus)
    })

    test('renders its data', () => {
      /**********************/
      /* ProductListing.vue */
      /**********************/

      const title = ProductListingComponent.find("[data-testid='product-listing__title']")
      const ProductListingItemComponents =
        ProductListingComponent.findAllComponents(ProductListingItem)

      // Assert the title is rendered
      expect(title.text()).toContain(mockTitle)

      // Assert all the ProductListingComponent component has been rendered
      expect(ProductListingItemComponents).toHaveLength(mockPromotionsLength)

      /**************************/
      /* ProductListingItem.vue */
      /**************************/

      // Assert any product(promotion) is rendered with necessary information
      ProductListingItemComponents.forEach((Product, index) => {
        const link = Product.findComponent(RouterLinkStub)
        const image = Product.find("[data-testid='product-listing__item-image']")
        const title = Product.find("[data-testid='product-listing__item-title']")
        const originalPrice = Product.find("[ data-testid='product-listing__item-original-price']")
        const discountedPrice = Product.find(
          "[ data-testid='product-listing__item-discounted-price']",
        )
        const mockProduct = mockPromotions[index]
        const mockProductURL = mockProduct.url
        const mockProductImageURL = mockProduct.image.url
        const mockProductImageALT = mockProduct.image.alt
        const mockProductTitle = mockProduct.title
        const mockProductOriginalPrice = mockProduct.price
        const mockProductDiscountedPrice = mockProduct.promotionalPrice

        // Assert the link has the correct url
        expect(link.props('to')).toBe(mockProductURL)

        // Assert the image has the correct "src" value
        expect(image.attributes('src')).toBe(mockProductImageURL)

        // Assert the image has the correct "alt" value
        expect(image.attributes('alt')).toBe(mockProductImageALT)

        // Assert the title is rendered
        expect(title.text()).toContain(mockProductTitle)

        // Assert the original price is rendered
        expect(originalPrice.text()).toContain(mockProductOriginalPrice)

        // Assert the discounted price is rendered
        expect(discountedPrice.text()).toContain(mockProductDiscountedPrice)
      })
    })
  })
})
