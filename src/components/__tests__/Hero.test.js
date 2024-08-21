import { flushPromises, mount } from "@vue/test-utils";
import Hero from "@/components/hero.vue";
import SlideShow from "@/components/SlideShow.vue";
import { getHeroSlides } from "@/composables/fetch";
import frontDataBase from "../../../db.json";

const slides = frontDataBase.heroSlides;

describe("Hero component:", () => {
  vi.mock("@/composables/fetch", () => {
    return {
      getHeroSlides: vi.fn(),
    };
  });
  getHeroSlides.mockReturnValue(slides);

  test("renders the SlideShow component with its expected props value", async () => {
    // Mount the component
    const wrapper = mount(Hero);
    await flushPromises();

    // Assert the SlideShow component is rendered
    const SlideShowComponent = wrapper.findComponent(SlideShow);
    expect(SlideShowComponent.exists()).toBe(true);

    // Assert the SlideShow's "slides" prop value is well setted
    expect(SlideShowComponent.props("slides")).toMatchObject(slides);
  });
});
