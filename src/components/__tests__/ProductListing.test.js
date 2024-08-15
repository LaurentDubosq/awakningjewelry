import { mount } from "@vue/test-utils";
import ProductListing from "@/components/ProductListing.vue";
import ProductListingItem from "@/components/ProductListingItem.vue";
import FrontDataBase from "../../../db.json";

const productListingPromotionsData = FrontDataBase.productListingPromotions;

describe("ProductListing component:", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(ProductListing, {
      props: { data: productListingPromotionsData },
    });
  });

  test("renders its title", () => {
    const titleElement = wrapper.find("[data-testid='productListing__title']");
    expect(titleElement.text()).toContain(productListingPromotionsData.title);
  });

  test("renders its list item entirely with", () => {
    const ProductListingItemComponents =
      wrapper.findAllComponents(ProductListingItem);
    expect(ProductListingItemComponents).toHaveLength(
      productListingPromotionsData.products.length
    );
  });

  test("renders its item with the expected 'product' value", () => {
    const firstProductListingItemComponent =
      wrapper.findComponent(ProductListingItem);
    expect(firstProductListingItemComponent.props("product")).toMatchObject(
      productListingPromotionsData.products[0]
    );
  });
});
