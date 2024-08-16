import { flushPromises, mount } from "@vue/test-utils";
import HomeView from "@/views/HomeView.vue";
import CommentBar from "@/components/CommentBar.vue";
import frontDataBase from "../../../db.json";
import { getCommentBarData } from "@/composables/fetch";

const commentBarData = frontDataBase.commentBar;

describe("HomeView component:", () => {
  let wrapper;

  vi.mock("@/composables/fetch", () => {
    return {
      getCommentBarData: vi.fn(),
      getCollectionListingGender: vi.fn(),
      getProductListingPromotions: vi.fn(),
    };
  });
  getCommentBarData.mockReturnValue(commentBarData);

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
});
