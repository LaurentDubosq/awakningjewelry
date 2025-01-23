import { flushPromises, mount } from "@vue/test-utils";
import HomeView from "@/views/HomeView.vue";
import Hero from "@/components/Hero.vue";
import StatementBanner from "@/components/StatementBanner.vue";
import CollectionListing from "@/components/CollectionListing.vue";
import CollectionListingItem from "@/components/CollectionListingItem.vue";
import ProductListing from "@/components/ProductListing.vue";
import ProductListingItem from "@/components/ProductListingItem.vue";
import frontDataBase from "../../../db.json";
import {
  getStatementMission,
  getCollectionsByGender,
  getPromotions,
} from "@/data/dataFetchers";
import router from "@/router";

// Mocks data
const mockStatementBannerResult = {
  data: { value: frontDataBase.statementMission },
  status: { value: "resolved" },
};
const mockStatementBannerData = mockStatementBannerResult.data.value;
const mockCollectionsByGenderResult = {
  data: { value: frontDataBase.collectionsByGender },
  status: { value: "resolved" },
};
const mockCollectionsByGenderData = mockCollectionsByGenderResult.data.value;
const mockPromotionsResult = {
  data: { value: frontDataBase.promotions },
  status: { value: "resolved" },
};
const mockPromotionsData = mockPromotionsResult.data.value;

// Mocks fetchers with data
vi.mock("@/data/dataFetchers", () => {
  return {
    getPagesMetaData: vi.fn().mockReturnValue(undefined), // used in the mocked router
    getStatementMission: vi.fn(),
    getCollectionsByGender: vi.fn(),
    getPromotions: vi.fn(),
  };
});
getStatementMission.mockReturnValue(mockStatementBannerResult);
getCollectionsByGender.mockReturnValue(mockCollectionsByGenderResult);
getPromotions.mockReturnValue(mockPromotionsResult);

// Component Factory
function mountHomeview() {
  return mount(HomeView, {
    global: {
      stubs: {
        Hero: true,
        StatementBanner,
        CollectionListing,
        ProductListing,
      },
      plugins: [router],
    },
  });
}

describe("HomeView.vue", () => {
  let wrapper;

  beforeEach(async () => {
    wrapper = mountHomeview();
  });

  // Smoke test
  test("mounts successfully", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  describe("Hero.vue", () => {
    test("is rendered", async () => {
      // Wait after the Hero.vue async import has been resolved
      await flushPromises();

      // Assert the Hero component is rendered
      const HeroComponent = wrapper.findComponent(Hero);
      expect(HeroComponent.exists()).toBeTruthy();
    });
  });

  describe("StatementBanner.vue", () => {
    let StatementBannerComponent;
    const mockStatement = mockStatementBannerData;
    const mockStatementTitle = mockStatement.title;
    const mockStatementText = mockStatement.text;
    const mockStatementImageURL = mockStatement.image.url;
    const mockStatementImageAlt = mockStatement.image.alt;

    beforeEach(() => {
      StatementBannerComponent = wrapper.findComponent(StatementBanner);
    });

    test("is rendered with necessary information", () => {
      // Assert the component is rendered
      expect(StatementBannerComponent.exists()).toBeTruthy();

      // Assert its "statementResult" prop has the correct value
      expect(StatementBannerComponent.props("statementResult")).toMatchObject(
        mockStatementBannerResult
      );
    });

    test("renders its data", () => {
      const title = StatementBannerComponent.find(
        "[data-testid='statement-banner__title']"
      );
      const text = StatementBannerComponent.find(
        "[data-testid='statement-banner__text']"
      );
      const image = StatementBannerComponent.find(
        "[data-testid='statement-banner__image']"
      );

      // Assert its title is rendered
      expect(title.text()).toContain(mockStatementTitle);

      // Assert its text is rendered
      expect(text.text()).toContain(mockStatementText);

      // Assert the image "src" attribute has the correct value
      expect(image.attributes("src")).toBe(mockStatementImageURL);

      // Assert the image "alt" attribute has the correct value
      expect(image.attributes("alt")).toBe(mockStatementImageAlt);
    });
  });

  describe("CollectionListing.vue", () => {
    let CollectionListingComponent;
    const mockTitle = "By Gender";
    const mockCollections = mockCollectionsByGenderData;
    const mockCollectionsLength = mockCollections.length;

    beforeEach(() => {
      CollectionListingComponent = wrapper.findComponent(CollectionListing);
    });

    test("is rendered with necessary information", () => {
      // Assert the component is rendered
      expect(CollectionListingComponent.exists()).toBeTruthy();

      // Assert its "title" prop value has the correct value
      expect(CollectionListingComponent.props("title")).toBe(mockTitle);

      // Assert its "collectionsResult" prop value has the correct value
      expect(
        CollectionListingComponent.props("collectionsResult")
      ).toMatchObject(mockCollectionsByGenderResult);
    });

    test("renders its data", () => {
      /*************************/
      /* CollectionListing.vue */
      /*************************/

      const title = CollectionListingComponent.find(
        "[data-testid='collection-listing__title']"
      );
      const CollectionListingItemComponents =
        CollectionListingComponent.findAllComponents(CollectionListingItem);

      // Assert the title is rendered
      expect(title.text()).toContain(mockTitle);

      // Assert all the CollectionListingItem component has been rendered
      expect(CollectionListingItemComponents).toHaveLength(
        mockCollectionsLength
      );

      /*****************************/
      /* CollectionListingItem.vue */
      /*****************************/

      // Assert any collection data is rendered
      CollectionListingItemComponents.forEach(
        (CollectionListingItemComponent, index) => {
          const link = CollectionListingItemComponent.find(
            "[data-testid='collection-listing__link']"
          );
          const img = CollectionListingItemComponent.find(
            "[data-testid='collection-listing__item-img']"
          );
          const title = CollectionListingItemComponent.find(
            "[data-testid='collection-listing__item-title']"
          );
          const mockCollection = mockCollections[index];
          const mockCollectionURL = mockCollection.url;
          const mockCollectionImageURL = mockCollection.image.url;
          const mockCollectionTitle = mockCollection.title;

          // Assert the link tag has the correct "url" value
          expect(link.attributes("href")).toBe(mockCollectionURL);

          // Assert its image has the correct "src" value
          expect(img.attributes("src")).toBe(mockCollectionImageURL);

          // Assert its title is rendered
          expect(title.text()).toContain(mockCollectionTitle);
        }
      );
    });
  });

  describe("ProductListing.vue", () => {
    let ProductListingComponent;
    const mockTitle = "Promotions";
    const mockProductsResult = mockPromotionsResult;
    const mockProductsData = mockPromotionsResult.data.value;
    const mockProductsLength = mockProductsData.length;

    beforeEach(() => {
      ProductListingComponent = wrapper.findComponent(ProductListing);
    });

    test("is rendered with necessary information", () => {
      // Assert the component is rendered
      expect(ProductListingComponent.exists()).toBeTruthy();

      // Assert its "title" prop has the correct value
      expect(ProductListingComponent.props("title")).toBe(mockTitle);

      // Assert its "productsResult" prop has the correct value
      expect(ProductListingComponent.props("productsResult")).toMatchObject(
        mockProductsResult
      );
    });

    test("renders its data", () => {
      /**********************/
      /* ProductListing.vue */
      /**********************/

      const title = ProductListingComponent.find(
        "[data-testid='product-listing__title']"
      );
      const ProductListingItemComponents =
        ProductListingComponent.findAllComponents(ProductListingItem);

      // Assert the title is rendered
      expect(title.text()).toContain(mockTitle);

      // Assert all the ProductListingComponent component has been rendered
      expect(ProductListingItemComponents).toHaveLength(mockProductsLength);

      /**************************/
      /* ProductListingItem.vue */
      /**************************/

      // Assert any product is rendered with necessary information
      ProductListingItemComponents.forEach((Product, index) => {
        const link = Product.find("[data-testid='product-listing__item-link']");
        const image = Product.find(
          "[data-testid='product-listing__item-image']"
        );
        const title = Product.find(
          "[data-testid='product-listing__item-title']"
        );
        const originalPrice = Product.find(
          "[ data-testid='product-listing__item-original-price']"
        );
        const discountedPrice = Product.find(
          "[ data-testid='product-listing__item-discounted-price']"
        );
        const mockProduct = mockProductsData[index];
        const mockProductURL = mockProduct.url;
        const mockProductImageURL = mockProduct.image.url;
        const mockProductImageALT = mockProduct.image.alt;
        const mockProductTitle = mockProduct.title;
        const mockProductOriginalPrice = mockProduct.price;
        const mockProductDiscountedPrice = mockProduct.promotionalPrice;

        // Assert the link tag has the correct "href" value
        expect(link.attributes("href")).toBe(mockProductURL);

        // Assert the image has the correct "src" value
        expect(image.attributes("src")).toBe(mockProductImageURL);

        // Assert the image has the correct "alt" value
        expect(image.attributes("alt")).toBe(mockProductImageALT);

        // Assert the title is rendered
        expect(title.text()).toContain(mockProductTitle);

        // Assert the original price is rendered
        expect(originalPrice.text()).toContain(mockProductOriginalPrice);

        // Assert the discounted price is rendered
        expect(discountedPrice.text()).toContain(mockProductDiscountedPrice);
      });
    });
  });
});
