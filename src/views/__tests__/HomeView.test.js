import { flushPromises, mount } from "@vue/test-utils";
import HomeView from "@/views/HomeView.vue";
import Hero from "@/components/Hero.vue";
import CommentBar from "@/components/CommentBar.vue";
import CollectionListing from "@/components/CollectionListing.vue";
import ProductListing from "@/components/ProductListing.vue";
import frontDataBase from "../../../db.json";
import {
  getCommentBarMissionData,
  getCollectionListingGenderData,
  getProductListingPromotionsData,
} from "@/composables/fetch";

const commentBarData = frontDataBase.commentBarMissionData;
const collectionListingGenderData = frontDataBase.collectionListingGenderData;
const productListingPromotionsData = frontDataBase.productListingPromotionsData;

describe("HomeView component:", () => {
  let wrapper;
  let HeroComponent;
  let CommentBarComponent;
  let CollectionListingComponent;
  let ProductListingComponent;

  vi.mock("@/composables/fetch", () => {
    return {
      getCommentBarMissionData: vi.fn(),
      getCollectionListingGenderData: vi.fn(),
      getProductListingPromotionsData: vi.fn(),
    };
  });
  getCommentBarMissionData.mockReturnValue(commentBarData);
  getCollectionListingGenderData.mockReturnValue(collectionListingGenderData);
  getProductListingPromotionsData.mockReturnValue(productListingPromotionsData);

  beforeEach(async () => {
    wrapper = mount(HomeView, {
      global: {
        stubs: { Hero: true, CommentBar, CollectionListing, ProductListing },
      },
    });
    await flushPromises();

    HeroComponent = wrapper.findComponent(Hero);
    CommentBarComponent = wrapper.findComponent(CommentBar);
    CollectionListingComponent = wrapper.findComponent(CollectionListing);
    ProductListingComponent = wrapper.findComponent(ProductListing);
  });

  describe("Hero component:", () => {
    test("is rendered", () => {
      expect(HeroComponent.exists()).toBe(true);
    });
  });

  describe("CommentBar component:", () => {
    test("is rendered", () => {
      expect(CommentBarComponent.exists()).toBe(true);
    });

    it("has its 'data' prop value well setted", () => {
      expect(CommentBarComponent.props("data")).toMatchObject(commentBarData);
    });
  });

  describe("CollectionListing component:", () => {
    test("is rendered", () => {
      expect(CollectionListingComponent.exists()).toBe(true);
    });

    it("has its 'data' prop value well setted", () => {
      expect(CollectionListingComponent.props("data")).toMatchObject(
        collectionListingGenderData
      );
    });
  });

  describe("ProductListing component:", () => {
    test("is rendered", () => {
      expect(ProductListingComponent.exists()).toBe(true);
    });

    it("has its 'data' prop value well setted", () => {
      expect(ProductListingComponent.props("data")).toMatchObject(
        productListingPromotionsData
      );
    });
  });
});
