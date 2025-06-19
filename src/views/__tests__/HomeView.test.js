import { mount, RouterLinkStub } from '@vue/test-utils'
import HomeView from '@/views/HomeView.vue'
import Hero from '@/components/Hero.vue'
import NewsletterSignup from '@/components/NewsletterSignup.vue'
import StatementBanner from '@/components/StatementBanner.vue'
import CollectionListing from '@/components/CollectionListing.vue'
import ProductListing from '@/components/ProductListing.vue'
import QuoteBanner from '@/components/QuoteBanner.vue'
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

const mockStatementMissionWordingPendingResult = {
  wording: undefined,
  wordingFetchState: 'pending',
}
const mockStatementMissionWordingRejectedResult = {
  wording: undefined,
  wordingFetchState: 'rejected',
}
const mockStatementMissionWordingFulfilledResult = {
  wording: frontDataBase.statementMissionWording,
  wordingFetchState: 'fulfilled',
}
const mockStatementMissionWording = mockStatementMissionWordingFulfilledResult.wording
const mockStatementMissionWordingTitle = mockStatementMissionWording.title
const mockStatementMissionWordingStatement = mockStatementMissionWording.statement
const mockStatementMissionWordingImageURL = mockStatementMissionWording.image.url
const mockStatementMissionWordingImageAlt = mockStatementMissionWording.image.alt

const mockCollectionListingByGenderPending = {
  content: undefined,
  contentFetchState: 'pending',
}
const mockCollectionListingByGenderRejected = {
  content: undefined,
  contentFetchState: 'rejected',
}
const mockCollectionListingByGenderFulfilled = {
  content: frontDataBase.collectionListingByGender,
  contentFetchState: 'fulfilled',
}
const mockCollectionListingByGender = mockCollectionListingByGenderFulfilled.content
const mockCollectionListingByGenderTitle = mockCollectionListingByGender.title
const mockCollectionListingByGenderFeatureLabel = `Explore our collections ${mockCollectionListingByGenderTitle}`
const mockCollectionListingByGenderCollections = mockCollectionListingByGender.collections
const mockCollectionListingByGenderCollectionsLength =
  mockCollectionListingByGenderCollections.length

const mockPromotionsProductListingContentPending = {
  content: undefined,
  contentFetchState: 'pending',
}
const mockPromotionsProductListingContentRejected = {
  content: undefined,
  contentFetchState: 'rejected',
}
const mockPromotionsProductListingContentFulfilled = {
  content: frontDataBase.promotionsProductListingContent,
  contentFetchState: 'fulfilled',
}
const mockContent = mockPromotionsProductListingContentFulfilled.content
const mockProductsTitle = mockContent.title
const mockProducts = mockContent.products
const mockProductsLength = mockProducts.length

const mockFounderQuoteBannerContentPendingResult = {
  content: undefined,
  contentFetchState: 'pending',
}
const mockFounderQuoteBannerContentRejectedResult = {
  content: undefined,
  contentFetchState: 'rejected',
}
const mockFounderQuoteBannerContentFulfilledResult = {
  content: frontDataBase.founderQuoteBannerContent,
  contentFetchState: 'fulfilled',
}
const mockFounderQuoteBannerContent = frontDataBase.founderQuoteBannerContent
const mockFounderQuoteBannerContentQuote = mockFounderQuoteBannerContent.quote
const mockFounderQuoteBannerContentFounder = mockFounderQuoteBannerContent.author
const mockFounderQuoteBannerContentFounderIMG = mockFounderQuoteBannerContent.authorIMG
const mockFounderQuoteBannerContentFounderIMGAlt = mockFounderQuoteBannerContent.authorIMGAlt
const mockFounderQuoteBannerContentFounderIMGTitle = mockFounderQuoteBannerContent.authorIMGTitle
const mockFounderQuoteBannerContentLinkText = mockFounderQuoteBannerContent.linkText
const mockFounderQuoteBannerContentLinkURL = mockFounderQuoteBannerContent.linkURL

/* Stores */

// Initialize a testing pinia instance
const mockPinia = createTestingPinia({ stubActions: false })

// Create the stores
const mockUseStatementMissionWordingResultStore = defineStore(
  'StatementMissionWordingResult',
  () => {
    const wordingFetchResult = ref(mockStatementMissionWordingPendingResult)
    const wording = computed(() => wordingFetchResult.value.wording)
    const wordingFetchState = computed(() => wordingFetchResult.value.wordingFetchState)
    return {
      wordingFetchResult,
      wording,
      wordingFetchState,
    }
  },
)

const mockUseCollectionListingByGenderStore = defineStore('CollectionListingByGender', () => {
  const fetchResult = ref(mockCollectionListingByGenderPending)
  const content = computed(() => fetchResult.value.content)
  const contentFetchState = computed(() => fetchResult.value.contentFetchState)
  return {
    fetchResult,
    content,
    contentFetchState,
  }
})

const mockUsePromotionsProductListingContentStore = defineStore(
  'PromotionsProductListingContent',
  () => {
    const fetchResult = ref(mockPromotionsProductListingContentPending)
    const content = computed(() => fetchResult.value.content)
    const contentFetchState = computed(() => fetchResult.value.contentFetchState)
    return {
      fetchResult,
      content,
      contentFetchState,
    }
  },
)

const mockUseFounderQuoteBannerContentResultStore = defineStore(
  'FounderQuoteBannerContentResult',
  () => {
    const contentFetchResult = ref(mockFounderQuoteBannerContentPendingResult)
    const content = computed(() => contentFetchResult.value?.content)
    const contentFetchState = computed(() => contentFetchResult.value?.contentFetchState)
    return { contentFetchResult, content, contentFetchState }
  },
)

// Initialize the stores
const mockStatementMissionWordingResultStore = mockUseStatementMissionWordingResultStore()
const mockCollectionListingByGenderStore = mockUseCollectionListingByGenderStore()
const mockPromotionsProductListingContentStore = mockUsePromotionsProductListingContentStore()
const mockFounderQuoteBannerContentResultStore = mockUseFounderQuoteBannerContentResultStore()

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

// WARNING : The component has 3 states regarding the data fetching status for all child components. "Pending", "Rejected" and "Fulfilled". The state by default is "Pending".

describe('HomeView.vue', () => {
  let wrapper

  beforeEach(async () => {
    // Component mounting (Data fetching "Pending" state)
    wrapper = mountHomeview()
  })

  afterEach(() => {
    // Reset the store(s) state(s) to default to ensure a clean environment for each test
    mockStatementMissionWordingResultStore.wordingFetchResult =
      mockStatementMissionWordingPendingResult
    mockCollectionListingByGenderStore.fetchResult = mockCollectionListingByGenderPending
    mockPromotionsProductListingContentStore.fetchResult =
      mockPromotionsProductListingContentPending
    mockFounderQuoteBannerContentResultStore.contentFetchResult =
      mockFounderQuoteBannerContentPendingResult
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

      // Quote Banner
      const QuoteBannerComponent = wrapper.findComponent(QuoteBanner)
      const QuoteBannerLoadingComponent = QuoteBannerComponent.findComponent(LoadingComponent)
      expect(QuoteBannerLoadingComponent.exists()).toBeTruthy()
    })
  })

  describe('Data fetching "Rejected" state', () => {
    test('the error messages are rendered', async () => {
      // Set the stores data fetching status to rejected
      mockStatementMissionWordingResultStore.wordingFetchResult =
        mockStatementMissionWordingRejectedResult
      mockCollectionListingByGenderStore.fetchResult = mockCollectionListingByGenderRejected
      mockPromotionsProductListingContentStore.fetchResult =
        mockPromotionsProductListingContentRejected
      mockFounderQuoteBannerContentResultStore.contentFetchResult =
        mockFounderQuoteBannerContentRejectedResult
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

      // Quote Banner
      const QuoteBannerComponent = wrapper.findComponent(QuoteBanner)
      const QuoteBannerErrorComponent = QuoteBannerComponent.findComponent(ErrorComponent)
      expect(QuoteBannerErrorComponent.exists()).toBeTruthy()
    })
  })

  describe('Data fetching "Fulfilled" state', () => {
    beforeEach(async () => {
      // Set the stores data fetching status to fulfilled
      mockStatementMissionWordingResultStore.wordingFetchResult =
        mockStatementMissionWordingFulfilledResult
      mockCollectionListingByGenderStore.fetchResult = mockCollectionListingByGenderFulfilled
      mockPromotionsProductListingContentStore.fetchResult =
        mockPromotionsProductListingContentFulfilled
      mockFounderQuoteBannerContentResultStore.contentFetchResult =
        mockFounderQuoteBannerContentFulfilledResult
      await nextTick()
    })

    test('statement mission is rendered with its necessary information', () => {
      // Find the elements
      const StatementBannerComponent = wrapper.findComponent(StatementBanner)
      const title = StatementBannerComponent.find("[data-testid='statement-banner__title']")
      const statement = StatementBannerComponent.find("[data-testid='statement-banner__statement']")
      const image = StatementBannerComponent.find("[data-testid='statement-banner__image']")

      // Assert its title is rendered
      expect(title.text()).toContain(mockStatementMissionWordingTitle)

      // Assert its text is rendered
      expect(statement.text()).toContain(mockStatementMissionWordingStatement)

      // Assert the image is rendered
      expect(image.exists()).toBeTruthy()

      // Assert the image "src" attribute is well setted
      expect(image.attributes('src')).toBe(mockStatementMissionWordingImageURL)

      // Assert the image "alt" attribute is well setted
      expect(image.attributes('alt')).toBe(mockStatementMissionWordingImageAlt)
    })

    test('collection listing is rendered with its necessary information', () => {
      // Assert the feature label for accessibility is rendered
      const section = wrapper.find("[data-testid='collection-listing']")
      expect(section.attributes('aria-label')).toBe(mockCollectionListingByGenderFeatureLabel)

      // Assert the title is rendered
      const title = wrapper.find("[data-testid='collection-listing__title']")
      expect(title.text()).toContain(mockCollectionListingByGenderTitle)

      // Assert the title is not rendered for screen readers
      expect(title.attributes('aria-hidden')).toBe('true')

      // Find the collections elements
      const CollectionListingComponent = wrapper.findComponent(CollectionListing)
      const collections = CollectionListingComponent.findAll(
        "[data-testid='collection-listing__item']",
      )

      // Assert that all collections are rendered
      expect(collections).toHaveLength(mockCollectionListingByGenderCollectionsLength)

      // Assert any collection is rendered with necessary information
      collections.forEach((collection, index) => {
        const link = collection.findComponent(RouterLinkStub)
        const img = collection.find("[data-testid='collection-listing__item-img']")
        const title = collection.find("[data-testid='collection-listing__item-title']")
        const mockCollection = mockCollectionListingByGenderCollections[index]
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

    test('product listing is rendered with their necessary information', () => {
      // Assert the title is rendered
      const title = wrapper.find("[data-testid='product-listing__title']")
      expect(title.text()).toContain(mockProductsTitle)

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

    test('Quote Founder is rendered with its necessary information', () => {
      // Assert the quote is rendered
      const quote = wrapper.find("[data-testid='quote-banner__quote']")
      expect(quote.html()).toContain(mockFounderQuoteBannerContentQuote)

      // Assert the author's name
      const author = wrapper.find("[data-testid='quote-banner__author']")
      expect(author.text()).toContain(mockFounderQuoteBannerContentFounder)

      // Assert the author's photo
      const photo = wrapper.find("[data-testid='quote-banner__author-photo']")
      expect(photo.exists()).toBeTruthy()
      expect(photo.attributes('src')).toContain(mockFounderQuoteBannerContentFounderIMG)
      expect(photo.attributes('alt')).toContain(mockFounderQuoteBannerContentFounderIMGAlt)
      expect(photo.attributes('title')).toContain(mockFounderQuoteBannerContentFounderIMGTitle)

      // Assert the link button
      const quoteBanner = wrapper.find("[data-testid='quote-banner']")
      const link = quoteBanner.findComponent(RouterLinkStub)
      expect(link.exists()).toBeTruthy()
      expect(link.html()).toContain(mockFounderQuoteBannerContentLinkText)
      expect(link.props('to')).toContain(mockFounderQuoteBannerContentLinkURL)
    })
  })
})
