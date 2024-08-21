import { flushPromises, mount } from "@vue/test-utils";
import SlideShow from "@/components/SlideShow.vue";
import HeroSlide from "@/components/HeroSlide.vue";
import frontDataBase from "../../../db.json";

const heroSlides = frontDataBase.heroSlides;

describe("SlideShow component:", () => {
  let wrapper;

  beforeEach(async () => {
    wrapper = mount(SlideShow, {
      attachTo: document.body,
      props: {
        slides: heroSlides,
        slidesLength: heroSlides.length,
        selectedSlideIndexToDisplay: 0,
      },
    });
    await flushPromises();
  });

  test("renders the entire slide list item", () => {
    const HeroSlideComponents = wrapper.findAllComponents(HeroSlide);
    expect(HeroSlideComponents).toHaveLength(heroSlides.length);
  });

  test("renders the initial slide at initial render", () => {
    const firstHeroSlideComponent = wrapper.findComponent(HeroSlide);

    // Assert the initial slide is shown
    expect(firstHeroSlideComponent.isVisible()).toBe(true);

    // Assert its props are well setted
    expect(firstHeroSlideComponent.props("slideIndex")).toBe(0);
    expect(firstHeroSlideComponent.props("slide")).toMatchObject(heroSlides[0]);
    expect(firstHeroSlideComponent.props("slidesLength")).toBe(
      heroSlides.length
    );
  });

  test("don't renders other slides at initial render", async () => {
    const secondHeroSlideComponent = wrapper.findAllComponents(HeroSlide)[1];
    expect(secondHeroSlideComponent.isVisible()).toBe(false);
  });

  test("renders automatically all slides during a loop", async () => {
    const firstHeroSlideComponent = wrapper.findComponent(HeroSlide);
    const secondHeroSlideComponent = wrapper.findAllComponents(HeroSlide)[1];
    const thirdHeroSlideComponent = wrapper.findAllComponents(HeroSlide)[2];

    // Wait 3.5 secondes
    await new Promise((resolve) => setTimeout(resolve, 3500));
    // Assert the second slide is rendered
    expect(secondHeroSlideComponent.isVisible()).toBe(true);
    // Assert the first slide is no longer rendered
    expect(firstHeroSlideComponent.isVisible()).toBe(false);

    // Wait 3.5 secondes
    await new Promise((resolve) => setTimeout(resolve, 3500));
    // Assert the third slide is rendered
    expect(thirdHeroSlideComponent.isVisible()).toBe(true);
    // Assert the second slide is no longer rendered
    expect(secondHeroSlideComponent.isVisible()).toBe(false);

    // Wait 3.5 secondes
    await new Promise((resolve) => setTimeout(resolve, 3500));
    // Assert the first slide after a complete loop is rendered
    expect(firstHeroSlideComponent.isVisible()).toBe(true);
    // Assert the third slide is no longer rendered
    expect(thirdHeroSlideComponent.isVisible()).toBe(false);
  }, 11000);

  test("renders the expected slide after a clic on its corresponding slick slider dot", async () => {
    const thirdSlickSliderDotElement = wrapper.findAll(
      "[data-testid='hero__slide-slick-slider-dot']"
    )[2];

    await thirdSlickSliderDotElement.trigger("click");

    // Assert the third slide is rendered
    const thirdHeroSlideComponent = wrapper.findAllComponents(HeroSlide)[2];
    expect(thirdHeroSlideComponent.isVisible()).toBe(true);
  });

  test("renders previous slide after left swipe", async () => {
    const slideShowElement = wrapper.find("[data-testid='slideShow']");
    const HeroSlideComponents = wrapper.findAllComponents(HeroSlide);
    const lastHeroSlideComponent =
      HeroSlideComponents[HeroSlideComponents.length - 1];

    // Swipe to the left
    await slideShowElement.trigger("touchstart", {
      changedTouches: [{ screenX: 100 }],
    });
    await slideShowElement.trigger("touchend", {
      changedTouches: [{ screenX: 10 }],
    });

    // Assert the last slide is rendered
    expect(lastHeroSlideComponent.isVisible()).toBe(true);
  });

  test("renders next slide after right swipe", async () => {
    const slideShowElement = wrapper.find("[data-testid='slideShow']");
    const SecondHeroSlideComponent = wrapper.findAllComponents(HeroSlide)[1];

    // Swipe to the right
    await slideShowElement.trigger("touchstart", {
      changedTouches: [{ screenX: 10 }],
    });
    await slideShowElement.trigger("touchend", {
      changedTouches: [{ screenX: 100 }],
    });

    // Assert the second slide is rendered
    expect(SecondHeroSlideComponent.isVisible()).toBe(true);
  });
});
