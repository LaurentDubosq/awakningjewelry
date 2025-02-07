import { mount } from "@vue/test-utils";
import SlideshowSlickSlider from "@/components/SlideshowSlickSlider.vue";

const mockSlidesLength = 2;
const mockCurrentIndex = 0;
const mockHandleClickPayload = { index: 0, focusable: false };
const mockHandleKeydownArrowWhenIndexAt0Payload = {
  index: mockSlidesLength - 1,
  focusable: true,
};
const mockHandleKeydownArrowWhenIndexAt1Payload = {
  index: 0,
  focusable: true,
};
const mockHandleKeydownHomePayload = { index: 0, focusable: true };
const mockHandleKeydownEndPayload = {
  index: mockSlidesLength - 1,
  focusable: true,
};

// Component Factory
const mountSlideshowSlickSlider = (props) => {
  return mount(SlideshowSlickSlider, {
    props: {
      slidesLength: mockSlidesLength,
      currentIndex: mockCurrentIndex,
      ...props,
    },
  });
};

describe("SlideshowSlickSlider.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountSlideshowSlickSlider();
  });

  // Smoke Test
  test("mounts successfully", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  test("is rendered with necessary information", () => {
    const slickSlider = wrapper.find("[data-testid='slideshow__slick-slider']");

    // Assert the slick slider is rendered
    expect(slickSlider.exists()).toBeTruthy();
  });

  test("render all the expected buttons with necessary information", () => {
    const buttons = wrapper.findAll(
      "[data-testid='slideshow__slick-slider-button']"
    );

    // Assert all the expected buttons are rendered
    expect(buttons).toHaveLength(mockSlidesLength);

    // Assert each button is rendered with necessary information
    buttons.forEach((button, index) => {
      // Assert the "aria-label" has the correct value
      expect(button.attributes("aria-label")).toBe(`Slide ${index + 1}`);

      // Assert the active CSS class is used when necessary
      expect(button.classes("slideshow__slick-slider-button--active")).toBe(
        index === mockCurrentIndex
      );
    });
  });

  describe("Behaviors:", () => {
    test("when a button is clicked, it emits the order to display the selected slide with its payload", async () => {
      // Click a button
      const button = wrapper.find(
        "[data-testid='slideshow__slick-slider-button']"
      );
      await button.trigger("click");

      // Assert the "display-slide" custom event has been emitted
      expect(wrapper.emitted("display-slide")).toHaveLength(1);

      // Assert its payload has the correct value
      expect(wrapper.emitted("display-slide")[0][0]).toStrictEqual(
        mockHandleClickPayload
      );
    });

    test("when the left arrow key is pressed, it emits the order to display the prev slide with its payload, until achieving 1 loop", async () => {
      const button = wrapper.find(
        "[data-testid='slideshow__slick-slider-button']"
      );

      // Press the left arrow key when we are on the first slide/first slick slider button
      await button.trigger("keydown", {
        key: "ArrowLeft",
        code: "ArrowLeft",
      });

      // Assert the "display-slide" custom event has been emitted
      expect(wrapper.emitted("display-slide")).toHaveLength(1);

      // Assert its payload has the correct value
      expect(wrapper.emitted("display-slide")[0][0]).toStrictEqual(
        mockHandleKeydownArrowWhenIndexAt0Payload
      );

      // Remount the component with the mockCurrentIndex props setted to the last slide index
      wrapper = mountSlideshowSlickSlider({ currentIndex: 1 });

      const buttons = wrapper.findAll(
        "[data-testid='slideshow__slick-slider-button']"
      );
      const lastButton = buttons[buttons.length - 1];

      // Press the left arrow key when we are on the last slide/last slick slider button
      await lastButton.trigger("keydown", {
        key: "ArrowLeft",
        code: "ArrowLeft",
      });

      // Assert the "display-slide" custom event has been emitted
      expect(wrapper.emitted("display-slide")).toHaveLength(1);

      // Assert its payload has the correct value
      expect(wrapper.emitted("display-slide")[0][0]).toStrictEqual(
        mockHandleKeydownArrowWhenIndexAt1Payload
      );
    });

    test("when the right arrow key is pressed, it emits the order to display the next slide with its payload, until achieving 1 loop", async () => {
      const button = wrapper.find(
        "[data-testid='slideshow__slick-slider-button']"
      );

      // Press the right arrow key when we are on the first slide/first slick slider button
      await button.trigger("keydown", {
        key: "ArrowRight",
        code: "ArrowRight",
      });

      // Assert the "display-slide" custom event has been emitted
      expect(wrapper.emitted("display-slide")).toHaveLength(1);

      // Assert its payload has the correct value
      expect(wrapper.emitted("display-slide")[0][0]).toStrictEqual(
        mockHandleKeydownArrowWhenIndexAt0Payload
      );

      // Remount the component with the mockCurrentIndex props setted to the last slide index
      wrapper = mountSlideshowSlickSlider({ currentIndex: 1 });

      const buttons = wrapper.findAll(
        "[data-testid='slideshow__slick-slider-button']"
      );
      const lastButton = buttons[buttons.length - 1];

      // Press the right arrow key when we are on the last slide/last slick slider button
      await lastButton.trigger("keydown", {
        key: "ArrowRight",
        code: "ArrowRight",
      });

      // Assert the "display-slide" custom event has been emitted
      expect(wrapper.emitted("display-slide")).toHaveLength(1);

      // Assert its payload has the correct value
      expect(wrapper.emitted("display-slide")[0][0]).toStrictEqual(
        mockHandleKeydownArrowWhenIndexAt1Payload
      );
    });

    test("when the home key is pressed, it emits the order to display the first slide with its payload", async () => {
      // Remount the component with the mockCurrentIndex props setted to the last slide index
      wrapper = mountSlideshowSlickSlider({ currentIndex: 1 });

      const buttons = wrapper.findAll(
        "[data-testid='slideshow__slick-slider-button']"
      );
      const lastButton = buttons[buttons.length - 1];

      // Press the "home" key when we are on the last slide/last slick slider button
      await lastButton.trigger("keydown", {
        key: "Home",
        code: "Home",
      });

      // Assert the "display-slide" custom event has been emitted
      expect(wrapper.emitted("display-slide")).toHaveLength(1);

      // Assert its payload has the correct value
      expect(wrapper.emitted("display-slide")[0][0]).toStrictEqual(
        mockHandleKeydownHomePayload
      );
    });

    test("when the 'end' key is pressed, it emits the order to display the last slide with its payload", async () => {
      const button = wrapper.find(
        "[data-testid='slideshow__slick-slider-button']"
      );

      // Press the "end" key when we are on the first slide/first slick slider button
      await button.trigger("keydown", {
        key: "End",
        code: "End",
      });

      // Assert the "display-slide" custom event has been emitted
      expect(wrapper.emitted("display-slide")).toHaveLength(1);

      // Assert its payload has the correct value
      expect(wrapper.emitted("display-slide")[0][0]).toStrictEqual(
        mockHandleKeydownEndPayload
      );
    });

    test("when a slick slider button is focused, its slick slider parent receives the CSS focus indicator, then when the slick slider button is blur, the slick slider parent loses the CSS class", async () => {
      // Focus on a slick slider button
      const button = wrapper.find(
        "[data-testid='slideshow__slick-slider-button']"
      );
      await button.trigger("focus");

      // Assert the slick slider receives the focus indicator
      expect(wrapper.classes("focus-visible")).toBeTruthy();

      // Blur on this slick slider button
      await button.trigger("blur");

      // Assert the slick slider receives the focus indicator
      expect(wrapper.classes("focus-visible")).toBeFalsy();
    });
  });
});
