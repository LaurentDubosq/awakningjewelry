import { mount, RouterLinkStub } from '@vue/test-utils'
import ProductListing from '@/components/ProductListing.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import frontDataBase from '../../../db.json'

/********************/
/* 1.Initialization */
/********************/

const mockProductsPending = {
  content: undefined,
  contentFetchState: 'pending',
}
const mockProductsRejected = {
  content: undefined,
  contentFetchState: 'rejected',
}
const mockProductsFulfilled = {
  content: frontDataBase.promotionsProductListingContent,
  contentFetchState: 'fulfilled',
}
const mockTitle = mockProductsFulfilled.content.title
const mockProducts = mockProductsFulfilled.content.products
const mockProductsLength = mockProducts.length

/***********/
/* 2.Build */
/***********/

// Component factory (Data fetching "Pending" state)
const mountProductListing = (props) => {
  return mount(ProductListing, {
    props: {
      content: mockProductsPending.content,
      contentFetchState: mockProductsPending.contentFetchState,
      ...props,
    },
    global: { stubs: { RouterLink: RouterLinkStub } },
  })
}

/**********/
/* 3.Test */
/**********/

// WARNING : The component has 3 states regarding the data fetching state. "Pending", "Rejected" and "Fulfilled". The state by default is "Pending".

describe('ProductListing.vue', () => {
  let wrapper

  beforeEach(() => {
    // Component mounting (Data fetching "Pending" state)
    wrapper = mountProductListing()
  })

  // Smoke test
  test('mounts successfully', () => {
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
      const wrapper = mountProductListing(mockProductsRejected)

      // Assert the error message is rendered
      const errorComponent = wrapper.findComponent(ErrorComponent)
      expect(errorComponent.exists()).toBeTruthy()
    })
  })

  describe('Data fetching "Fulfilled" state', () => {
    beforeEach(() => {
      // Mount the component (fulfilled state)
      wrapper = mountProductListing(mockProductsFulfilled)
    })

    test('renders its title', () => {
      const title = wrapper.find("[data-testid='product-listing__title']")
      expect(title.text()).toContain(mockTitle)
    })

    test('renders all the products with necessary information', () => {
      // Find the products elements
      const products = wrapper.findAll("[data-testid='product-listing__item']")

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
