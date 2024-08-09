import { flushPromises, mount } from "@vue/test-utils";
import Hero from "@/components/Hero.vue";
import HeroSlide from "@/components/HeroSlide.vue";
import { getHeroSlides } from "@/composables/fetch";
import frontDataBase from "../../../db.json";
import { expect } from "vitest";

const componentHeroSlides = frontDataBase.componentHeroSlides;

describe("Hero component:", () => {
  let wrapper;

  beforeEach(async () => {
    // Mock the slides Data getter function
    vi.mock("@/composables/fetch", () => {
      return {
        getHeroSlides: vi.fn(),
      };
    });
    getHeroSlides.mockReturnValue(componentHeroSlides);

    // Mount the component here to avoid repetition even if "attachTo" option is not necessary for all tests
    wrapper = mount(Hero, { attachTo: document.body });
    await flushPromises();
  });

  test("renders the slides entirely", async () => {
    const HeroSlideComponents = wrapper.findAllComponents(HeroSlide);
    expect(HeroSlideComponents).toHaveLength(componentHeroSlides.length);
  });

  test("renders the initial slide at initial render with its props well setted", async () => {
    const firstHeroSlideComponent = wrapper.findComponent(HeroSlide);

    // Assert the initial slide is shown
    expect(firstHeroSlideComponent.isVisible()).toBe(true);

    // Assert its props are well setted
    expect(firstHeroSlideComponent.props("displayedSlideIndex")).toBe(0);
    expect(firstHeroSlideComponent.props("slide")).toMatchObject(
      componentHeroSlides[0]
    );
    expect(firstHeroSlideComponent.props("slidesLength")).toBe(
      componentHeroSlides.length
    );
  });

  test("don't renders other slides at initial render", async () => {
    const HeroSlideComponents = wrapper.findAllComponents(HeroSlide);
    expect(HeroSlideComponents[1].isVisible()).toBe(false);
  });

  test("renders the expected slide after a clic on its corresponding slick slider dot", async () => {
    const thirdSlickSliderDotElement = wrapper.findAll(
      "[data-testid='hero__slide-slick-slider-dot']"
    )[2];

    await thirdSlickSliderDotElement.trigger("click");

    const thirdHeroSlideComponent = wrapper.findAllComponents(HeroSlide)[2];
    expect(thirdHeroSlideComponent.isVisible()).toBe(true);
  });

  test("renders previous slide after left swipe", async () => {
    const HeroSectionElement = wrapper.find("[data-testid='hero']");

    await HeroSectionElement.trigger("touchstart", {
      changedTouches: [{ screenX: 100 }],
    });
    await HeroSectionElement.trigger("touchend", {
      changedTouches: [{ screenX: 10 }],
    });

    const HeroSlideComponents = wrapper.findAllComponents(HeroSlide);
    const lastHeroSlideComponent =
      HeroSlideComponents[HeroSlideComponents.length - 1];
    expect(lastHeroSlideComponent.isVisible()).toBe(true);
  });

  test("renders next slide after right swipe", async () => {
    const HeroSectionElement = wrapper.find("[data-testid='hero']");

    await HeroSectionElement.trigger("touchstart", {
      changedTouches: [{ screenX: 10 }],
    });
    await HeroSectionElement.trigger("touchend", {
      changedTouches: [{ screenX: 100 }],
    });

    const SecondHeroSlideComponent = wrapper.findAllComponents(HeroSlide)[1];
    expect(SecondHeroSlideComponent.isVisible()).toBe(true);
  });
});
