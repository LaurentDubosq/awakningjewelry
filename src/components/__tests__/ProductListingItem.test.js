import { mount } from "@vue/test-utils";
import ProductListingItem from "@/components/ProductListingItem.vue";
import frontDataBase from "../../../db.json";

const product = frontDataBase.productListingPromotionsData.products[0];

describe("ProductListingItem component:", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(ProductListingItem, {
      props: { product },
    });
  });

  it("has its link url value well setted", () => {
    const linkElement = wrapper.find(
      "[data-testid='productListing__item-link']"
    );
    expect(linkElement.attributes("to")).toBe(product.url);
  });

  it("has its images props values well setted", () => {
    const imageElement = wrapper.find(
      "[data-testid='productListing__item-image']"
    );

    // Assert the "src" props value is well setted
    expect(imageElement.attributes("src")).toBe(product.image.url);

    // Assert the "alt" props value is well setted
    expect(imageElement.attributes("alt")).toBe(product.image.alt);
  });

  test("renders its title", () => {
    const titleElement = wrapper.find(
      "[data-testid='productListing__item-title']"
    );
    expect(titleElement.text()).toContain(product.title);
  });

  test("renders its title", () => {
    const titleElement = wrapper.find(
      "[data-testid='productListing__item-title']"
    );
    expect(titleElement.text()).toContain(product.title);
  });

  test("renders its price", () => {
    const priceElement = wrapper.find(
      "[data-testid='productListing__item-price']"
    );
    const TextContentPrice = priceElement.text();

    // Assert the base price is rendered
    expect(TextContentPrice).toContain(product.price);

    // Assert the promotional price is rendered
    expect(TextContentPrice).toContain(product.promotionalPrice);
  });
});
