import { flushPromises, mount } from "@vue/test-utils";
import HomeView from "@/views/HomeView.vue";
import CommentBar from "@/components/CommentBar.vue";
import CollectionListing from "@/components/CollectionListing.vue";
import ProductListing from "@/components/ProductListing.vue";
import frontDataBase from "../../../db.json";
import {
  getCommentBarMissionData,
  getCollectionListingGenderData,
  getProductListingPromotionsData,
} from "@/composables/fetch";

const commentBarData = frontDataBase.commentBar;
const collectionListingGenderData = frontDataBase.commentBar;
const productListingPromotionsData = frontDataBase.commentBar;

describe("HomeView component:", () => {
  let wrapper;

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
        stubs: { Hero: true },
      },
    });
    await flushPromises();
  });

  it("has its data prop value well setted on CommentBar component", () => {
    const CommentBarComponent = wrapper.findComponent(CommentBar);
    expect(CommentBarComponent.props("data")).toMatchObject(commentBarData);
  });

  it("has its data prop value well setted on CollectionListing component", () => {
    const CollectionListingComponent = wrapper.findComponent(CollectionListing);
    expect(CollectionListingComponent.props("data")).toMatchObject(
      collectionListingGenderData
    );
  });

  it("has its data prop value well setted on ProductListing component", () => {
    const ProductListingComponent = wrapper.findComponent(ProductListing);
    expect(ProductListingComponent.props("data")).toMatchObject(
      productListingPromotionsData
    );
  });
});
