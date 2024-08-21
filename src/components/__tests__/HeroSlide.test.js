import { beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import HeroSlide from "@/components/HeroSlide.vue";
import frontDataBase from "../../../db.json";
import SASSCONSTANTS from "@/assets/styles/_constants.module.scss";
import { useIsOnMobileKey } from "@/utils/injectionkeys";

const heroSlides = frontDataBase.heroSlides;
const AwakningBreakpointDesktop = SASSCONSTANTS.AwakningBreakpointDesktop;

describe("HeroSlide component:", () => {
  // Wrapper declaration
  let wrapper;

  beforeEach(() => {
    wrapper = mount(HeroSlide, {
      props: {
        slideIndex: 0,
        slide: heroSlides[0],
        slidesLength: heroSlides.length,
        currentDisplayedSlideIndex: 0,
        slidesLength: 3,
      },
      global: {
        provide: {
          [useIsOnMobileKey]: true,
        },
      },
    });
  });

  describe("Mobile image:", () => {
    test("is rendered with its props value well setted", () => {
      const imgElement = wrapper.find("[data-testid='hero__slide-image']");

      // Assert the mobile image is rendered
      expect(imgElement.exists()).toBe(true);

      // Assert the "src" attribute is well setted
      expect(imgElement.attributes("src")).toBe(heroSlides[0].images.mobile);

      // Assert the "alt" attribute is well setted
      expect(imgElement.attributes("alt")).toBe(heroSlides[0].images.alt);
    });
  });

  describe("Desktop image:", () => {
    /* the <source> element render can't be verified simulated browser environment, so, only its attributs are tested */
    test("has its attributes well setted", () => {
      const sourceElement = wrapper.find(
        "[data-testid='hero__slide-image-desktop']"
      );

      // Assert the "media" attribute is well setted
      expect(sourceElement.attributes("media")).toContain(
        AwakningBreakpointDesktop
      );

      // Assert the "srcset" attribute is well setted
      expect(sourceElement.attributes("srcset")).toBe(
        heroSlides[0].images.desktop
      );
    });
  });

  describe("Slick slider:", () => {
    test("renders all expected dots", () => {
      const slickSliderDotSpanElements = wrapper.findAll(
        "[data-testid='hero__slide-slick-slider-dot']"
      );
      expect(slickSliderDotSpanElements).toHaveLength(heroSlides.length);
    });

    it("has the active CSS dot class enabled on the corresponding slider dot", () => {
      const firstSliderDotSpanElement = wrapper.find(
        "[data-testid='hero__slide-slick-slider-dot']"
      );
      expect(
        firstSliderDotSpanElement.classes(
          "hero__slide-slick-slider-dot--active"
        )
      ).toBe(true);
    });

    it("should not have the active CSS dot class enabled on not corresponding slider dot", () => {
      const secondSliderDotSpanElement = wrapper.findAll(
        "[data-testid='hero__slide-slick-slider-dot']"
      )[1];
      expect(
        secondSliderDotSpanElement.classes(
          "hero__slide-slick-slider-dot--active"
        )
      ).toBe(false);
    });

    it("emits the dot custom event with its payload", async () => {
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

  describe("Subtitle:", () => {
    it("is rendered", () => {
      const subtitleElement = wrapper.find(
        "[data-testid='hero__slide-subtitle']"
      );
      expect(subtitleElement.text()).toBe(heroSlides[0].subtitle);
    });
  });

  describe("Title:", () => {
    it("is rendered", () => {
      const titleElement = wrapper.find("[data-testid='hero__slide-title']");
      expect(titleElement.text()).toBe(heroSlides[0].title);
    });
  });

  describe("Button link:", () => {
    test("is rendered with its link value well setted", () => {
      // Assert the button is rendered
      const buttonElement = wrapper.find("[data-testid='hero__slide-link']");
      expect(buttonElement.exists()).toBe(true);

      // Assert the button's link value is well setted
      const linkElement = wrapper.find("[data-testid='hero__slide-link']");
      expect(linkElement.attributes("to")).toBe(heroSlides[0].url);
    });
  });
});
