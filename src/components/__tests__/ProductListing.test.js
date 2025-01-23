import { mount } from "@vue/test-utils";
import ProductListing from "@/components/ProductListing.vue";
import ProductListingItem from "@/components/ProductListingItem.vue";
import LoadingComponent from "@/components/LoadingComponent.vue";
import ErrorComponent from "@/components/ErrorComponent.vue";
import frontDataBase from "../../../db.json";

const mockTitle = "Promotions";
const mockProductsResult = { data: { value: frontDataBase.promotions } };
const mockProductsData = mockProductsResult.data.value;
const mockProductsDataLength = mockProductsData.length;

// Component factory
function mountProductListing(status = "resolved") {
  return mount(ProductListing, {
    props: {
      title: mockTitle,
      productsResult: { ...mockProductsResult, status: { value: status } },
    },
    global: { stubs: { ProductListingItem: true } },
  });
}

describe("ProductListing.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountProductListing();
  });

  // Smoke test
  test("mounts successfully", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  test("renders its title", () => {
    const title = wrapper.find("[data-testid='product-listing__title']");
    expect(title.text()).toContain(mockTitle);
  });

  test("renders all the products with necessary information", () => {
    // Assert all the products are rendered
    const ProductListingItemComponent =
      wrapper.findAllComponents(ProductListingItem);
    expect(ProductListingItemComponent).toHaveLength(mockProductsDataLength);

    // Assert each product has its "product" prop value well setted
    ProductListingItemComponent.forEach((product, index) => {
      const mockProduct = mockProductsData[index];
      expect(product.props("product")).toMatchObject(mockProduct);
    });
  });

  describe("Behaviors:", () => {
    test("when the data fetcher status is 'pending', the loading component is rendered", () => {
      // Remount the component with pending status active
      wrapper = mountProductListing("pending");

      // Assert the loading component is rendered
      const loadingComponent = wrapper.findComponent(LoadingComponent);
      expect(loadingComponent.exists()).toBeTruthy();
    });

    test("when the data fetcher status is 'resolved', its data is rendered", () => {
      // Assert that one of its pieces of data is rendered
      const ProductListingItemComponent =
        wrapper.findComponent(ProductListingItem);
      expect(ProductListingItemComponent.exists()).toBeTruthy();
    });

    test("when the data fetcher status is 'rejected', the error component is rendered", () => {
      // Remount the component with rejected status active
      wrapper = mountProductListing("rejected");

      // Assert the error component is rendered
      const errorComponent = wrapper.findComponent(ErrorComponent);
      expect(errorComponent.exists()).toBeTruthy();
    });
  });
});
