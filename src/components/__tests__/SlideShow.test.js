import { flushPromises, mount } from "@vue/test-utils";
import SlideShow from "@/components/SlideShow.vue";
import HeroSlide from "@/components/HeroSlide.vue";
import frontDataBase from "../../../db.json";

const heroSlides = frontDataBase.heroSlides;

describe("SlideShow component:", () => {
  let wrapper;
  let HeroSlideComponents;
  let FirstHeroSlideComponent;
  let SecondHeroSlideComponent;
  let ThirdHeroSlideComponent;

  beforeEach(async () => {
    wrapper = mount(SlideShow, {
      attachTo: document.body,
      props: {
        slides: heroSlides,
      },
      global: {
        stubs: { HeroSlide },
      },
    });

    // Wait until the onMounted hook has been executed
    await flushPromises();

    HeroSlideComponents = wrapper.findAllComponents(HeroSlide);
    FirstHeroSlideComponent = HeroSlideComponents[0];
    SecondHeroSlideComponent = HeroSlideComponents[1];
    ThirdHeroSlideComponent = HeroSlideComponents[2];
  });

  test("renders the entire slide list item", () => {
    expect(HeroSlideComponents).toHaveLength(heroSlides.length);
  });

  describe("Each slide:", () => {
    wrapper = mount(SlideShow, {
      props: {
        slides: heroSlides,
      },
      global: {
        stubs: { HeroSlide },
      },
    });
    const HeroSlideComponents = wrapper.findAllComponents(HeroSlide);

    heroSlides.forEach((slide, index) => {
      describe(`at index ${index}:`, () => {
        const HeroSlideComponent = HeroSlideComponents[index];

        test("exists (doesn't mean it is visible)", () => {
          expect(HeroSlideComponent.exists()).toBe(true);
        });

        test("has its expected props values", () => {
          expect(HeroSlideComponent.props("slide")).toMatchObject(
            heroSlides[index]
          );
          expect(HeroSlideComponent.props("slideIndex")).toBe(index);
          expect(HeroSlideComponent.props("slidesLength")).toBe(
            heroSlides.length
          );
        });
      });
    });
  });

  test("renders each slide one by one automatically during a loop by hiding the others", async () => {
    // Assert the first slide is showned at initial render
    expect(FirstHeroSlideComponent.isVisible()).toBe(true);
    // Assert the second slide is not rendered
    expect(SecondHeroSlideComponent.isVisible()).toBe(false);
    // Assert the third slide is not rendered
    expect(ThirdHeroSlideComponent.isVisible()).toBe(false);

    // Wait 3.5 secondes
    await new Promise((resolve) => setTimeout(resolve, 3500));
    // Assert the second slide is rendered
    expect(SecondHeroSlideComponent.isVisible()).toBe(true);
    // Assert the first slide is no longer rendered
    expect(FirstHeroSlideComponent.isVisible()).toBe(false);

    // Wait 3.5 secondes
    await new Promise((resolve) => setTimeout(resolve, 3500));
    // Assert the third slide is rendered
    expect(ThirdHeroSlideComponent.isVisible()).toBe(true);
    // Assert the second slide is no longer rendered
    expect(SecondHeroSlideComponent.isVisible()).toBe(false);

    // Wait 3.5 secondes
    await new Promise((resolve) => setTimeout(resolve, 3500));
    // Assert the first slide after a complete loop is rendered
    expect(FirstHeroSlideComponent.isVisible()).toBe(true);
    // Assert the third slide is no longer rendered
    expect(ThirdHeroSlideComponent.isVisible()).toBe(false);
  }, 11000);

  test("renders another slide after a clic on its corresponding slick slider dot", async () => {
    // Get the third slick slider dot and clic on it
    const thirdSlickSliderDotElement = wrapper.findAll(
      "[data-testid='hero__slide-slick-slider-dot']"
    )[2];
    await thirdSlickSliderDotElement.trigger("click");

    // Assert the third slide is rendered
    expect(ThirdHeroSlideComponent.isVisible()).toBe(true);
  });

  test("renders the same slide when we clic on the current slick slider dot", async () => {
    // Get the current slick slider dot and clic on it
    const firstSlickSliderDotElement = wrapper.find(
      "[data-testid='hero__slide-slick-slider-dot']"
    );
    await firstSlickSliderDotElement.trigger("click");

    // Assert the first slide is  still rendered
    expect(FirstHeroSlideComponent.isVisible()).toBe(true);
  });

  test("renders each previous slide after left swipes during a loop", async () => {
    const slideShowElement = wrapper.find("[data-testid='slideShow']");

    // Swipe left to the last slide
    await slideShowElement.trigger("touchstart", {
      changedTouches: [{ screenX: 100 }],
    });
    await slideShowElement.trigger("touchend", {
      changedTouches: [{ screenX: 10 }],
    });

    // Assert the last slide is rendered
    expect(ThirdHeroSlideComponent.isVisible()).toBe(true);

    // Swipe left to the second slide
    await slideShowElement.trigger("touchstart", {
      changedTouches: [{ screenX: 100 }],
    });
    await slideShowElement.trigger("touchend", {
      changedTouches: [{ screenX: 10 }],
    });

    // Assert the second slide is rendered
    expect(SecondHeroSlideComponent.isVisible()).toBe(true);

    // Swipe left to the starting slide
    await slideShowElement.trigger("touchstart", {
      changedTouches: [{ screenX: 100 }],
    });
    await slideShowElement.trigger("touchend", {
      changedTouches: [{ screenX: 10 }],
    });

    // Assert the starting slide is rendered
    expect(FirstHeroSlideComponent.isVisible()).toBe(true);
  });

  test("renders next slide after right swipe", async () => {
    const slideShowElement = wrapper.find("[data-testid='slideShow']");

    // Swipe right to the second slide
    await slideShowElement.trigger("touchstart", {
      changedTouches: [{ screenX: 10 }],
    });
    await slideShowElement.trigger("touchend", {
      changedTouches: [{ screenX: 100 }],
    });

    // Assert the second slide is rendered
    expect(SecondHeroSlideComponent.isVisible()).toBe(true);

    // Swipe right to the last slide
    await slideShowElement.trigger("touchstart", {
      changedTouches: [{ screenX: 10 }],
    });
    await slideShowElement.trigger("touchend", {
      changedTouches: [{ screenX: 100 }],
    });

    // Assert the last slide is rendered
    expect(ThirdHeroSlideComponent.isVisible()).toBe(true);

    // Swipe right to the starting slide
    await slideShowElement.trigger("touchstart", {
      changedTouches: [{ screenX: 10 }],
    });
    await slideShowElement.trigger("touchend", {
      changedTouches: [{ screenX: 100 }],
    });

    // Assert the starting slide is rendered
    expect(FirstHeroSlideComponent.isVisible()).toBe(true);
  });
});
