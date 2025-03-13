import { mount, RouterLinkStub } from '@vue/test-utils'
import { ref } from 'vue'
import Slideshow from '@/components/Slideshow.vue'
import SlideshowAutorotationButton from '@/components/SlideshowAutorotationButton.vue'
import SlideshowSlickSlider from '@/components/SlideshowSlickSlider.vue'
import IconPause from '@/components/icons/IconPause.vue'
import IconPlay from '@/components/icons/IconPlay.vue'
import HeroSlide from '@/components/HeroSlide.vue'
import frontDataBase from '../../../db.json'
import { createTestingPinia } from '@pinia/testing'
import { h, defineComponent } from 'vue'
import { defineStore } from 'pinia'

/**************/
/* 1.Hoisting */
/**************/

// Mock the "useGetClientHeightAtElementResize" composable
vi.mock('@/composables/useGetClientHeightAtElementResize', () => {
  return {
    useGetClientHeightAtElementResize: vi.fn().mockReturnValue(ref(100)),
  }
})

/*********************/
/* 2.Initializations */
/*********************/

/* Data */

const mockSlides = frontDataBase.heroSlides.slice(0, 2) // only two slides are enough to perform the tests
const mockSlidesLength = mockSlides.length
const mockCurrentIndex = 0

/* Slot */

// In order to test the dynamic behavior of Slideshow.vue, we need a dummy component to mock the slot with a dynamic content
const mockHeroSlideComponent = defineComponent({
  props: ['currentIndex'],
  data() {
    return {
      mockSlides,
      mockSlidesLength,
    }
  },
  components: {
    HeroSlide,
  },
  template: `
    <HeroSlide
      v-for="(slide, index) in mockSlides"
      :key="slide.id"
      :slide
      :slidesLength="mockSlidesLength"
      :slideIndex="index"
      :isActive="index === currentIndex"
      v-show="index === currentIndex"
    />
  `,
})

/* Stores */

// Initialize a testing pinia instance
const pinia = createTestingPinia()

// Create the stores
const useIsReducedMotionStore = defineStore('IsReducedMotion', () => {
  const isReducedMotion = ref(false)
  return { isReducedMotion }
})

const useIsOnMobileStore = defineStore('IsOnMobile', () => {
  const isOnMobile = ref(true)
  return { isOnMobile }
})

// Initialize the stores
const isReducedMotionStore = useIsReducedMotionStore()
useIsOnMobileStore()

/***********/
/* 3.Build */
/***********/

// Component Factory
function mountSlideshow() {
  return mount(Slideshow, {
    attachTo: document.body,
    props: { slidesLength: mockSlidesLength },
    slots: {
      default: ({ currentIndex }) => h(mockHeroSlideComponent, { currentIndex }), // send the local currentIndex variable to mockHeroSlideComponent component as props
    },
    global: {
      plugins: [pinia],
      stubs: { RouterLink: RouterLinkStub },
    },
  })
}

/**********/
/* 4.Test */
/**********/

describe('Slideshow.vue', () => {
  let wrapper

  beforeEach(() => {
    isReducedMotionStore.isReducedMotion = false // reset to the default value
    wrapper = mountSlideshow()
  })

  // Smoke test
  test('mounts successfully', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('SlideshowAutorotationButton.vue', () => {
    test('render the component with necessary information', () => {
      const SlideshowSlickSliderComponent = wrapper.findComponent(SlideshowAutorotationButton)

      // Assert the component is rendered
      expect(SlideshowSlickSliderComponent.exists()).toBeTruthy()

      // Assert its "isPlaying" prop has the correct value
      expect(SlideshowSlickSliderComponent.props('isPlaying')).toBe(true)
    })

    describe("'pause' button variant:", () => {
      test("renders the 'pause' button with necessary information", () => {
        const button = wrapper.find("[data-testid='slideshow__autorotation-button']")
        const IconPauseComponent = wrapper.findComponent(IconPause)

        // Assert the "pause" icon component is rendered
        expect(IconPauseComponent.exists()).toBeTruthy()

        // Assert the "aria-label" is rendered with the correct value
        expect(button.attributes('aria-label')).toBe('Stop automatic slide show')
      })

      describe('Behaviors:', () => {
        test("when the 'pause' button is clicked, it stops the slideshow autorotation", async () => {
          // Click the button
          const button = wrapper.find("[data-testid='slideshow__autorotation-button']")
          await button.trigger('click')

          // Wait 3.5 seconds (Delay between two slides)
          await new Promise((resolve) => setTimeout(resolve, 3500))

          // Assert the first/starting slide is still rendered
          const FirstHeroSlideComponent = wrapper.findComponent(HeroSlide)
          expect(FirstHeroSlideComponent.isVisible()).toBeTruthy()
        }, 7500)
      })
    })

    describe("'play' button variant:", () => {
      test("renders the 'play' button with necessary information", async () => {
        // Click the 'pause' button to display the 'play' button
        const button = wrapper.find("[data-testid='slideshow__autorotation-button']")
        await button.trigger('click')

        // Assert the "play" icon component is rendered
        const IconPlayComponent = wrapper.findComponent(IconPlay)
        expect(IconPlayComponent.exists()).toBeTruthy()

        // Assert the "aria-label" is rendered with the correct value
        expect(button.attributes('aria-label')).toBe('Start automatic slide show')
      })

      describe('Behaviors:', () => {
        test("when the 'play' button is clicked, it starts again the slideshow autorotation", async () => {
          // Click the 'pause' button to display the 'play' button
          const button = wrapper.find("[data-testid='slideshow__autorotation-button']")
          await button.trigger('click')

          // Click the 'play' button to start again the autorotation
          await button.trigger('click')

          // Wait 3.5 seconds (Delay between two slides)
          await new Promise((resolve) => setTimeout(resolve, 3500))

          // Assert the second slide is rendered
          const HeroSlideComponents = wrapper.findAllComponents(HeroSlide)
          const SecondHeroSlideComponent = HeroSlideComponents[1]
          expect(SecondHeroSlideComponent.isVisible()).toBeTruthy()
        }, 7500)
      })
    })
  })

  describe('SlideshowSlickSlider.vue', () => {
    const mockSlickSliderTopPosition = undefined

    test('render the component with necessary information', () => {
      const SlideshowSlickSliderComponent = wrapper.findComponent(SlideshowSlickSlider)

      // Assert the component is rendered
      expect(SlideshowSlickSliderComponent.exists()).toBeTruthy()

      // Assert its "slickSliderTopPosition" prop has the correct value
      expect(SlideshowSlickSliderComponent.props('slickSliderTopPosition')).toBe(
        mockSlickSliderTopPosition,
      )

      // Assert its "slidesLength" prop has the correct value
      expect(SlideshowSlickSliderComponent.props('slidesLength')).toBe(mockSlidesLength)

      // Assert its "currentIndex" prop has the correct value
      expect(SlideshowSlickSliderComponent.props('currentIndex')).toBe(mockCurrentIndex)
    })

    test('render all its expected buttons with necessary information', () => {
      const buttons = wrapper.findAll("[data-testid='slideshow__slick-slider-button']")

      // Assert all the expected buttons are rendered
      expect(buttons).toHaveLength(mockSlidesLength)

      // Assert each button is rendered with necessary information
      buttons.forEach((button, index) => {
        // Assert the "aria-label" has the correct value
        expect(button.attributes('aria-label')).toBe(`Slide ${index + 1}`)

        // Assert the active CSS class is used when necessary
        expect(button.classes('slideshow__slick-slider-button--active')).toBe(
          index === mockCurrentIndex,
        )
      })
    })

    describe('Behaviors:', () => {
      test('when another button is clicked, it displays its slide', async () => {
        // Click the second button
        const buttons = wrapper.findAll("[data-testid='slideshow__slick-slider-button']")
        const secondButton = buttons[1]
        await secondButton.trigger('click')

        // Assert the second slide is rendered
        const HeroSlideComponents = wrapper.findAllComponents(HeroSlide)
        const SecondHeroSlideComponent = HeroSlideComponents[1]
        expect(SecondHeroSlideComponent.isVisible()).toBeTruthy()
      })

      test('when the left arrow key is pressed, it displays the previous slide, until achieving 1 loop', async () => {
        const HeroSlideComponents = wrapper.findAllComponents(HeroSlide)

        // Assert the starting/first slide is rendered
        const FirstHeroSlideComponent = HeroSlideComponents[0]
        expect(FirstHeroSlideComponent.isVisible()).toBeTruthy()

        // Press the left arrow key from its corresponding slick slider button
        const button = wrapper.find("[data-testid='slideshow__slick-slider-button']")
        await button.trigger('keydown', {
          key: 'ArrowLeft',
          code: 'ArrowLeft',
        })

        // Assert the last/second slide is rendered
        const LastHeroSlideComponent = HeroSlideComponents[HeroSlideComponents.length - 1]
        expect(LastHeroSlideComponent.isVisible()).toBeTruthy()

        // Press the left arrow key again to achieve 1 loop
        await button.trigger('keydown', {
          key: 'ArrowLeft',
          code: 'ArrowLeft',
        })

        // Assert the starting/first slide is rendered again
        expect(FirstHeroSlideComponent.isVisible()).toBeTruthy()
      })

      test('when the right arrow key is pressed, it displays the next slide, until achieving 1 loop', async () => {
        const HeroSlideComponents = wrapper.findAllComponents(HeroSlide)

        // Assert the starting/first slide is rendered
        const FirstHeroSlideComponent = HeroSlideComponents[0]
        expect(FirstHeroSlideComponent.isVisible()).toBeTruthy()

        // Press the right arrow key from its corresponding slick slider button
        const button = wrapper.find("[data-testid='slideshow__slick-slider-button']")
        await button.trigger('keydown', {
          key: 'ArrowRight',
          code: 'ArrowRight',
        })

        // Assert the second/last slide is rendered
        const SecondHeroSlideComponent = HeroSlideComponents[1]
        expect(SecondHeroSlideComponent.isVisible()).toBeTruthy()

        // Press the right arrow key again to achieve 1 lopp
        await button.trigger('keydown', {
          key: 'ArrowRight',
          code: 'ArrowRight',
        })

        // Assert the starting/first slide is rendered again
        expect(FirstHeroSlideComponent.isVisible()).toBeTruthy()
      })

      test('when the home key is pressed, it displays the first slide, and the first slick slider button is focused', async () => {
        const slickSliderButtons = wrapper.findAll("[data-testid='slideshow__slick-slider-button']")
        const firstSlickSliderButton = slickSliderButtons[0]
        const secondSlickSliderButton = slickSliderButtons[1]
        const HeroSlideComponents = wrapper.findAllComponents(HeroSlide)
        const FirstHeroSlideComponent = HeroSlideComponents[0]
        const SecondHeroSlideComponent = HeroSlideComponents[1]

        // Click on the second slick slider button
        await secondSlickSliderButton.trigger('click')

        // Focus the second slick slider button
        await secondSlickSliderButton.element.focus()

        // Assert the second slide is rendered
        expect(SecondHeroSlideComponent.isVisible()).toBeTruthy()

        // Assert the second slick slider button is focused
        expect(document.activeElement).toBe(secondSlickSliderButton.element)

        // Press the "home" key
        await firstSlickSliderButton.trigger('keydown', {
          key: 'Home',
          code: 'Home',
        })

        // Assert the first slide is rendered
        expect(FirstHeroSlideComponent.isVisible()).toBeTruthy()

        // Assert the first slick slider button is focused
        expect(document.activeElement).toBe(firstSlickSliderButton.element)
      })

      test("when the 'end' key is pressed, it displays the last slide, and the last slick slider button is focused", async () => {
        const slickSliderButtons = wrapper.findAll("[data-testid='slideshow__slick-slider-button']")
        const firstSlickSliderButton = slickSliderButtons[0]
        const secondSlickSliderButton = slickSliderButtons[1]
        const HeroSlideComponents = wrapper.findAllComponents(HeroSlide)
        const FirstHeroSlideComponent = HeroSlideComponents[0]
        const SecondHeroSlideComponent = HeroSlideComponents[1]

        // Click and focus on the first slick slider button to ensure the future changes
        await firstSlickSliderButton.trigger('click')
        await firstSlickSliderButton.element.focus()

        // Assert the first slide is rendered
        expect(FirstHeroSlideComponent.isVisible()).toBeTruthy()

        // Assert the first slick slider button is focused
        expect(document.activeElement).toBe(firstSlickSliderButton.element)

        // Press the "end" key
        await firstSlickSliderButton.trigger('keydown', {
          key: 'End',
          code: 'End',
        })

        // Assert the last(second) slide is rendered
        expect(SecondHeroSlideComponent.isVisible()).toBeTruthy()

        // Assert the last(second) slick slider button is focused
        expect(document.activeElement).toBe(secondSlickSliderButton.element)
      })
    })
  })

  describe('Slot:', () => {
    test('renders the slot content', () => {
      // Assert the slot content is rendered
      const slotContent = wrapper.findComponent(mockHeroSlideComponent)
      expect(slotContent.exists()).toBeTruthy()

      // Assert its "currentIndex" slot props has the correct initial value
      expect(slotContent.props('currentIndex')).toBe(mockCurrentIndex)
    })
  })

  describe('Behaviors:', () => {
    test('autorotation is active by default and render properly each slide during 1 loop, and check other slides are not visible', async () => {
      const HeroSlideComponents = wrapper.findAllComponents(HeroSlide)
      const FirstHeroSlideComponent = HeroSlideComponents[0]
      const SecondHeroSlideComponent = HeroSlideComponents[1]

      // Assert the first/starting slide is showned at initial render
      expect(FirstHeroSlideComponent.isVisible()).toBeTruthy()
      // Assert the second/last slide is not rendered
      expect(SecondHeroSlideComponent.isVisible()).toBeFalsy()

      // Wait 3.5 seconds (Delay between two slides)
      await new Promise((resolve) => setTimeout(resolve, 3500))
      // Assert the second/last slide is rendered
      expect(SecondHeroSlideComponent.isVisible()).toBeTruthy()
      // Assert the first/starting slide is no longer rendered
      expect(FirstHeroSlideComponent.isVisible()).toBeFalsy()

      // Wait 3.5 seconds (Delay between two slides)
      await new Promise((resolve) => setTimeout(resolve, 3500))
      // Assert the first/starting slide after a complete loop is rendered
      expect(FirstHeroSlideComponent.isVisible()).toBeTruthy()
      // Assert the second/last slide is no longer rendered
      expect(SecondHeroSlideComponent.isVisible()).toBeFalsy()
    }, 11000)

    test('when the user has the reduce motion activated, the autorotation should be pause at initial render', async () => {
      // Enable the reduce motion feature to block animations
      isReducedMotionStore.isReducedMotion = true

      // Mount the component with the reduce motion feature updated
      wrapper = mountSlideshow()

      const HeroSlideComponents = wrapper.findAllComponents(HeroSlide)
      const FirstHeroSlideComponent = HeroSlideComponents[0]

      // Assert the first/starting slide is showned at initial render
      expect(FirstHeroSlideComponent.isVisible()).toBeTruthy()

      // Wait 3.5 seconds (Delay between two slides)
      await new Promise((resolve) => setTimeout(resolve, 3500))

      // Assert the first/starting slide is still rendered
      expect(FirstHeroSlideComponent.isVisible()).toBeTruthy()
    })

    test('when the user hovers over the slideshow, the autorotation should stop, then when the mouse leaves the slideshow, the autorotation should resume', async () => {
      const slideShow = wrapper.find("[data-testid='slideshow']")
      const HeroSlideComponents = wrapper.findAllComponents(HeroSlide)
      const FirstHeroSlideComponent = HeroSlideComponents[0]
      const SecondHeroSlideComponent = HeroSlideComponents[1]

      // Assert the first/starting slide is showned at initial render
      expect(FirstHeroSlideComponent.isVisible()).toBeTruthy()

      // Wait 3.5 seconds (Delay between two slides)
      await new Promise((resolve) => setTimeout(resolve, 3500))

      // Assert the autorotation is on by asserting that the second/last slide is rendered
      expect(SecondHeroSlideComponent.isVisible()).toBeTruthy()

      // Hover the slideshow
      await slideShow.trigger('mouseenter')

      // Wait 3.5 seconds (Delay between two slides)
      await new Promise((resolve) => setTimeout(resolve, 3500))

      // Assert the autorotation has been stopped by asserting that the second/last slide is still rendered
      expect(SecondHeroSlideComponent.isVisible()).toBeTruthy()

      // Mouse leaves the slideshow
      await slideShow.trigger('mouseleave')

      // Wait 3.5 seconds (Delay between two slides)
      await new Promise((resolve) => setTimeout(resolve, 3500))

      // Assert the autorotation has resume by asserting that the next (first/starting) slide is rendered
      expect(FirstHeroSlideComponent.isVisible()).toBeTruthy()
    }, 11000)

    test("when user focus a slick slider button, the autorotation is stopped, then start again when the 'play' button is clicked", async () => {
      const HeroSlideComponents = wrapper.findAllComponents(HeroSlide)
      const FirstHeroSlideComponent = HeroSlideComponents[0]
      const SecondHeroSlideComponent = HeroSlideComponents[1]

      // Assert the first/starting slide is rendered
      expect(FirstHeroSlideComponent.isVisible()).toBeTruthy()

      // Focus the first slick slider button
      const slickSliderButton = wrapper.find("[data-testid='slideshow__slick-slider-button']")
      slickSliderButton.trigger('focusin') // we use "focusin" instead of "focus" because in vue test utils, the latter doesn't trigger "focusin"

      // Wait 3.5 seconds (Delay between two slides)
      await new Promise((resolve) => setTimeout(resolve, 3500))

      // Assert carousel auto-play has been stopped
      expect(FirstHeroSlideComponent.isVisible()).toBeTruthy()

      // Click the "play" button
      const autorotationButton = wrapper.find("[data-testid='slideshow__autorotation-button']")
      await autorotationButton.trigger('click')

      // Wait 3.5 seconds (Delay between two slides)
      await new Promise((resolve) => setTimeout(resolve, 3500))

      // Assert carousel auto-play has been stopped
      expect(SecondHeroSlideComponent.isVisible()).toBeTruthy()
    }, 7500)

    test("when user navigates using the 'tab' key, the first slideshow focusable element should be the autorotation button", async () => {
      /* As the "tab" key doesn't move the focus using vue test utils, we prefere to check the focusable element position by their order */

      // Get the first focusable element
      const focusableElement = wrapper.find(
        'button, input, select, textarea, a[href], area, iframe, object, embed, details, audio, video, [tabindex="0"]',
      )

      // Assert the autorotation button is the first focusable element
      const button = wrapper.find("[data-testid='slideshow__autorotation-button']")
      expect(focusableElement.element).toBe(button.element)
    })

    test("when user navigates using the 'tab' key, the slick slider buttons should be focused before the slide content in the tab sequence", () => {
      /* As the "tab" key doesn't move the focus using vue test utils, we prefere to check the focusable element position by their order */

      // Get all the focusable elements
      const focusableElements = wrapper
        .findAll(
          'button, input, select, textarea, a, area, iframe, object, embed, details, audio, video, [tabindex="0"]',
        )
        .map((e) => e.element)

      // Get the slick slider first button position
      const firstSlickSliderButton = wrapper.find("[data-testid='slideshow__slick-slider-button']")
      const slickSliderPosition = focusableElements.indexOf(firstSlickSliderButton.element)

      // Get the slide content focusable button/link position
      const slideContentButton = wrapper.find("[data-testid='hero__slide-link']")
      const slideContentButtonPosition = focusableElements.indexOf(slideContentButton.element)

      // Assert the slick slider buttons are before the slide content button/link focusable element in the tab sequence
      expect(slickSliderPosition).toBeLessThan(slideContentButtonPosition)
    })

    test('when a user resumes the autorotation, any focus and hover are ignored', async () => {
      const HeroSlideComponents = wrapper.findAllComponents(HeroSlide)
      const FirstHeroSlideComponent = HeroSlideComponents[0]
      const SecondHeroSlideComponent = HeroSlideComponents[1]
      const autorotationButton = wrapper.find("[data-testid='slideshow__autorotation-button']")

      // Assert the first/starting slide is rendered
      expect(FirstHeroSlideComponent.isVisible()).toBeTruthy()

      // Pause the slideshow autorotation
      await autorotationButton.trigger('click')

      // Wait 3.5 seconds (Delay between two slides)
      await new Promise((resolve) => setTimeout(resolve, 3500))

      // Assert the slideshow is paused
      expect(FirstHeroSlideComponent.isVisible()).toBeTruthy()

      // Resume the slideshow autorotation
      await autorotationButton.trigger('click')

      // Wait 3.5 seconds (Delay between two slides)
      await new Promise((resolve) => setTimeout(resolve, 3500))

      // Assert the slideshow is resumed
      expect(SecondHeroSlideComponent.isVisible()).toBeTruthy()

      // Focus the first slick slider button
      const firstSlickSliderButton = wrapper.find("[data-testid='slideshow__slick-slider-button']")
      firstSlickSliderButton.trigger('focusin')

      // Wait 3.5 seconds (Delay between two slides)
      await new Promise((resolve) => setTimeout(resolve, 3500))

      // Assert the slideshow is still playing (the next slide is the starting slide)
      expect(FirstHeroSlideComponent.isVisible()).toBeTruthy()

      // Hover the slideshow
      const slideShow = wrapper.find("[data-testid='slideshow']")
      await slideShow.trigger('mouseenter')

      // Wait 3.5 seconds (Delay between two slides)
      await new Promise((resolve) => setTimeout(resolve, 3500))

      // Assert the slideshow is still playing
      expect(SecondHeroSlideComponent.isVisible()).toBeTruthy()
    }, 15000)

    test('renders the previous slides by left swipes, until achieving 1 loop', async () => {
      const slideShow = wrapper.find("[data-testid='slideshow']")
      const HeroSlideComponents = wrapper.findAllComponents(HeroSlide)
      const FirstHeroSlideComponent = HeroSlideComponents[0]
      const SecondHeroSlideComponent = HeroSlideComponents[1]

      // Assert the first/starting slide is rendered
      expect(FirstHeroSlideComponent.isVisible()).toBeTruthy()

      // Swipe left to the last slide
      await slideShow.trigger('touchstart', {
        changedTouches: [{ screenX: 100 }],
      })
      await slideShow.trigger('touchend', {
        changedTouches: [{ screenX: 10 }],
      })

      // Assert the second/last slide is rendered
      expect(SecondHeroSlideComponent.isVisible()).toBeTruthy()

      // Swipe left to the starting slide
      await slideShow.trigger('touchstart', {
        changedTouches: [{ screenX: 100 }],
      })
      await slideShow.trigger('touchend', {
        changedTouches: [{ screenX: 10 }],
      })

      // Assert the first/starting slide is rendered
      expect(FirstHeroSlideComponent.isVisible()).toBeTruthy()
    })

    test('renders the next slides by next swipes, until achieving 1 loop', async () => {
      const slideShow = wrapper.find("[data-testid='slideshow']")
      const HeroSlideComponents = wrapper.findAllComponents(HeroSlide)
      const FirstHeroSlideComponent = HeroSlideComponents[0]
      const SecondHeroSlideComponent = HeroSlideComponents[1]

      // Assert the first/starting slide is rendered
      expect(FirstHeroSlideComponent.isVisible()).toBeTruthy()

      // Swipe right to the second/last slide
      await slideShow.trigger('touchstart', {
        changedTouches: [{ screenX: 10 }],
      })
      await slideShow.trigger('touchend', {
        changedTouches: [{ screenX: 100 }],
      })

      // Assert the second/last slide is rendered
      expect(SecondHeroSlideComponent.isVisible()).toBeTruthy()

      // Swipe right to the starting slide
      await slideShow.trigger('touchstart', {
        changedTouches: [{ screenX: 10 }],
      })
      await slideShow.trigger('touchend', {
        changedTouches: [{ screenX: 100 }],
      })

      // Assert the first/starting slide is rendered
      expect(FirstHeroSlideComponent.isVisible()).toBeTruthy()
    })
  })
})
