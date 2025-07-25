import { mount, RouterLinkStub } from '@vue/test-utils'
import ProductListingItem from '@/components/ProductListingItem.vue'
import frontDataBase from '../../../db.json'

/********************/
/* 1.Initialization */
/********************/

const mockProduct = frontDataBase.promotionsProductListingContent.products[0]
const mockProductURL = mockProduct.url
const mockProductImageURL = mockProduct.image.url
const mockProductImageALT = mockProduct.image.alt
const mockProductTitle = mockProduct.title
const mockProductOriginalPrice = mockProduct.price
const mockProductDiscountedPrice = mockProduct.promotionalPrice

/***********/
/* 2.Build */
/***********/

// Component Factory
const mountProductListingItem = () => {
  return mount(ProductListingItem, {
    props: { product: mockProduct },
    global: {
      stubs: { RouterLink: RouterLinkStub },
    },
  })
}

/**********/
/* 3.Test */
/**********/

describe('ProductListingItem.vue', () => {
  let wrapper

  beforeEach(() => {
    // Mount the component
    wrapper = mountProductListingItem(ProductListingItem)
  })

  // Smoke test
  test('mounts successfully', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  test('renders product with necessary information', () => {
    const link = wrapper.findComponent(RouterLinkStub)
    const image = wrapper.find("[data-testid='product-listing__item-image']")
    const title = wrapper.find("[data-testid='product-listing__item-title']")
    const originalPrice = wrapper.find("[ data-testid='product-listing__item-original-price']")
    const discountedPrice = wrapper.find("[ data-testid='product-listing__item-discounted-price']")

    // Assert the product has link
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
