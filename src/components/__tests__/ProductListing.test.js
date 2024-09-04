import { mount } from "@vue/test-utils";
import ProductListing from "@/components/ProductListing.vue";
import ProductListingItem from "@/components/ProductListingItem.vue";
import FrontDataBase from "../../../db.json";

const productListingPromotionsData = FrontDataBase.productListingPromotionsData;
const products = productListingPromotionsData.products;

describe("ProductListing component:", () => {
  let wrapper;
  let ProductListingItemComponents;

  beforeEach(() => {
    wrapper = mount(ProductListing, {
      props: { data: productListingPromotionsData },
    });
    ProductListingItemComponents =
      wrapper.findAllComponents(ProductListingItem);
  });

  test("renders its title", () => {
    const titleElement = wrapper.find("[data-testid='productListing__title']");
    expect(titleElement.text()).toContain(productListingPromotionsData.title);
  });

  test("renders its list item entirely", () => {
    expect(ProductListingItemComponents).toHaveLength(products.length);
  });

  describe("Each Item:", () => {
    products.forEach((product, index) => {
      describe(`Item at index ${index}:`, () => {
        test("has its 'product' prop value well setted", () => {
          expect(
            ProductListingItemComponents[index].props("product")
          ).toMatchObject(products[index]);
        });
      });
    });
  });
});
