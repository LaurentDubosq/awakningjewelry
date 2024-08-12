import { beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import HeroSlide from "@/components/HeroSlide.vue";
import frontDataBase from "../../../db.json";
import SASSCONSTANTS from "@/assets/styles/_constants.module.scss";

const componentHeroSlides = frontDataBase.componentHeroSlides;
const AwakningBreakpointDesktop = SASSCONSTANTS.AwakningBreakpointDesktop;

describe("HeroSlide component:", () => {
  // Wrapper declaration
  let wrapper;

  beforeEach(() => {
    wrapper = mount(HeroSlide, {
      props: {
        slide: componentHeroSlides[0],
        displayedSlideIndex: 0,
        slidesLength: 3,
      },
    });
  });

  describe("images:", () => {
    it("should have the images attributes values well set", () => {
      const sourceElement = wrapper.find(
        "[data-testid='hero__slide-image-desktop']"
      );
      const imgElement = wrapper.find("[data-testid='hero__slide-image']");

      // Assert the attributes of source tag are well set
      expect(sourceElement.attributes("media")).toContain(
        AwakningBreakpointDesktop
      );
      expect(sourceElement.attributes("srcset")).toBe(
        componentHeroSlides[0].images.desktop
      );

      // Assert the attributes of img tag are well set
      expect(imgElement.attributes("src")).toBe(
        componentHeroSlides[0].images.mobile
      );
      expect(imgElement.attributes("alt")).toBe(
        componentHeroSlides[0].images.alt
      );
    });
  });

  describe("Slick slider dot:", () => {
    test("renders all expected dots", () => {
      const slickSliderDotSpanElements = wrapper.findAll(
        "[data-testid='hero__slide-slick-slider-dot']"
      );
      expect(slickSliderDotSpanElements).toHaveLength(
        componentHeroSlides.length
      );
    });

    it("should have the selected CSS class set for the displayed slides's dot", () => {
      const firstSliderDotSpanElement = wrapper.find(
        "[data-testid='hero__slide-slick-slider-dot']"
      );
      expect(
        firstSliderDotSpanElement.classes(
          "hero__slide-slick-slider-dot--selected"
        )
      ).toBe(true);
    });

    it("should not have the selected CSS class set for the non-displayed slides's dot", () => {
      const secondSliderDotSpanElement = wrapper.findAll(
        "[data-testid='hero__slide-slick-slider-dot']"
      )[1];
      expect(
        secondSliderDotSpanElement.classes(
          "hero__slide-slick-slider-dot--selected"
        )
      ).toBe(false);
    });

    it("should emits its custom event with its payload when clicked", async () => {
      const secondSliderDotSpanElement = wrapper.findAll(
        "[data-testid='hero__slide-slick-slider-dot']"
      )[1];

      await secondSliderDotSpanElement.trigger("click");

      // Assert the custom event has been emitted properly
      expect(wrapper.emitted("display-selected-slide")).toHaveLength(1);

      // Assert the custom event has been emitted with its payload
      expect(wrapper.emitted("display-selected-slide")[0][0]).toBe(1);
    });
  });

  describe("subtitle:", () => {
    test("is rendered", () => {
      const subtitleH3Element = wrapper.find(
        "[data-testid='hero__slide-subtitle']"
      );
      expect(subtitleH3Element.text()).toBe(componentHeroSlides[0].subtitle);
    });
  });

  describe("title:", () => {
    test("is rendered", () => {
      const titleH2Element = wrapper.find("[data-testid='hero__slide-title']");
      expect(titleH2Element.text()).toBe(componentHeroSlides[0].title);
    });
  });

  describe("link:", () => {
    test("URL value is well set", () => {
      const HeroSlideLinkElement = wrapper.find(
        "[data-testid='hero__slide-link']"
      );
      expect(HeroSlideLinkElement.attributes("to")).toBe(
        componentHeroSlides[0].url
      );
    });
  });
});
