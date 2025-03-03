import { mount } from '@vue/test-utils'
import ProductListingItem from '@/components/ProductListingItem.vue'
import frontDataBase from '../../../db.json'
import router from '@/router'

/**************/
/* 1.Hoisting */
/**************/

// Mock the "getPagesMetaData" data fetcher used in the mocked router
vi.mock('@/data/dataFetchers', () => {
  return {
    getPagesMetaData: vi.fn().mockReturnValue(undefined),
  }
})

/********************/
/* 2.Initialization */
/********************/

const mockProduct = frontDataBase.promotions[0]
const mockProductURL = mockProduct.url
const mockProductImageURL = mockProduct.image.url
const mockProductImageALT = mockProduct.image.alt
const mockProductTitle = mockProduct.title
const mockProductOriginalPrice = mockProduct.price
const mockProductDiscountedPrice = mockProduct.promotionalPrice

/***********/
/* 3.Build */
/***********/

// Component Factory
function mountProductListingItem() {
  return mount(ProductListingItem, {
    props: { product: mockProduct },
    global: {
      plugins: [router],
    },
  })
}

/**********/
/* 4.Test */
/**********/

describe('ProductListingItem.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mountProductListingItem(ProductListingItem)
  })

  // Smoke test
  test('mounts successfully', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  test('render product with necessary information', () => {
    const link = wrapper.find("[data-testid='product-listing__item-link']")
    const image = wrapper.find("[data-testid='product-listing__item-image']")
    const title = wrapper.find("[data-testid='product-listing__item-title']")
    const originalPrice = wrapper.find("[ data-testid='product-listing__item-original-price']")
    const discountedPrice = wrapper.find("[ data-testid='product-listing__item-discounted-price']")

    // Assert the link tag exists
    expect(link.exists()).toBeTruthy()

    // Assert the link tag has the correct "href" value
    expect(link.attributes('href')).toBe(mockProductURL)

    // Assert the image is rendered
    expect(image.exists()).toBeTruthy()

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
