import { flushPromises, mount } from "@vue/test-utils";
import HomeView from "@/views/HomeView.vue";
import CommentBar from "@/components/CommentBar.vue";
import CollectionListing from "@/components/CollectionListing.vue";
import frontDataBase from "../../../db.json";
import {
  getCommentBarData,
  getCollectionListingGenderData,
} from "@/composables/fetch";

const commentBarData = frontDataBase.commentBar;
const collectionListingGenderData = frontDataBase.commentBar;

describe("HomeView component:", () => {
  let wrapper;

  vi.mock("@/composables/fetch", () => {
    return {
      getCommentBarData: vi.fn(),
      getCollectionListingGenderData: vi.fn(),
      getProductListingPromotions: vi.fn(),
    };
  });
  getCommentBarData.mockReturnValue(commentBarData);
  getCollectionListingGenderData.mockReturnValue(collectionListingGenderData);

  beforeEach(() => {
    wrapper = mount(HomeView, {
      global: {
        stubs: { Hero: true },
      },
    });
  });

  it("has its data prop value well setted on CommentBar component", async () => {
    await flushPromises();
    const CommentBarComponent = wrapper.findComponent(CommentBar);
    expect(CommentBarComponent.props("data")).toMatchObject(commentBarData);
  });

  it("has its data prop value well setted on CollectionListing component", async () => {
    await flushPromises();
    const CollectionListingComponent = wrapper.findComponent(CollectionListing);
    expect(CollectionListingComponent.props("data")).toMatchObject(
      collectionListingGenderData
    );
  });
});
