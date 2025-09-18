import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import Slideshow from '@/components/Slideshow.vue'
import HeroSlide from '@/components/HeroSlide.vue'
import frontDataBase from '../../../db.json'
import { createTestingPinia } from '@pinia/testing'
import { h, defineComponent } from 'vue'
import { defineStore } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'

/**************/
/* 1.Hoisting */
/**************/

// Mock the "useGetClientHeightAtElementResize" composable used to position the slick slider on mobile
vi.mock('@/composables/useGetClientHeightAtElementResize', () => {
  return {
    default: vi.fn().mockReturnValue(ref(100)),
  }
})

/********************/
/* 2.Initialization */
/********************/

/* Router */

const mockRouter = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      component: defineComponent({
        template: '<div>Mocked Component</div>',
      }),
    },
  ],
})

/* Data */

const mockSlides = frontDataBase.heroSlides.slice(0, 2) // only two slides are enough to perform the tests
const mockSlidesLength = mockSlides.length
const mockActiveIndex = 0

/* Slot */

// In order to test the dynamic behavior of Slideshow.vue, we need a dummy component to mock the slot with a dynamic content (here 2 slides)
const mockHeroSlideComponent = defineComponent({
  props: ['deferredActiveIndex', 'isSlideLabelSRReadable'],
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
    <template v-for="(slide, index) in mockSlides" :key="slide.id">
      <HeroSlide
        class="slideshow__slide"
        :class="{ 'slideshow__slide--active': index === deferredActiveIndex }"
        :slide
        :slides-length="mockSlides.length"
        :slide-index="index"
        :is-active="index === deferredActiveIndex"
        :isSlideLabelSRReadable
        :style="{ visibility: index === deferredActiveIndex ? 'visible' : 'hidden' }"
      />
    </template>
  `,
})

/* Stores */

// Initialize a testing pinia instance
const mockPinia = createTestingPinia()

// Create the stores
const mockUseIsReducedMotionStore = defineStore('IsReducedMotion', () => {
  const isReducedMotion = ref(false)
  return { isReducedMotion }
})

const mockUseIsOnMobileStore = defineStore('IsOnMobile', () => {
  const isOnMobile = ref()
  return { isOnMobile }
})

// Initialize the stores
const mockIsReducedMotionStore = mockUseIsReducedMotionStore()
mockUseIsOnMobileStore()

/***********/
/* 3.Build */
/***********/

// Component Factory (Playing state is true - Reduce motion state is false)
const mountSlideshow = () => {
  return mount(Slideshow, {
    attachTo: document.body,
    props: { slidesLength: mockSlidesLength },
    slots: {
      default: ({ deferredActiveIndex, isSlideLabelSRReadable }) =>
        h(mockHeroSlideComponent, { deferredActiveIndex, isSlideLabelSRReadable }), // send the local deferredActiveIndex variable to mockHeroSlideComponent component as props
    },
    global: {
      plugins: [mockRouter, mockPinia],
    },
  })
}

/**********/
/* 4.Test */
/**********/

// WARNING : The component has 2 states regarding the slideshow playing state. True or false. The state by default is true.

// WARNING : The component has 2 states regarding the reduce motion state. True or false. The state by default is false.

describe('Slideshow.vue', () => {
  let wrapper

  beforeEach(() => {
    // Component mounting (Playing state is true - Reduce motion state is false)
    wrapper = mountSlideshow()
  })

  afterEach(() => {
    // Reset the store(s) state(s) to default to ensure a clean environment for each test
    mockIsReducedMotionStore.isReducedMotion = false
  })

  // Smoke test
  test('mounts successfully', async () => {
    // Assert the wrapper component is well mounted at initial render
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('Initial render - Playing state is true - Reduce motion state is false', () => {
    test('renders all the slides', () => {
      const HeroSlideComponents = wrapper.findAllComponents(HeroSlide)
      expect(HeroSlideComponents).toHaveLength(mockSlidesLength)
    })

    test('renders the slick slider button accessibility label', () => {
      const div = wrapper.find("[data-testid='slideshow__slick-slider']")
      expect(div.attributes('aria-label')).toContain('Manual slideshow navigation')
    })

    test('render all the slick slider buttons with their necessary information', () => {
      const buttons = wrapper.findAll("[data-testid='slideshow__slick-slider-button']")

      // Assert all the buttons are rendered
      expect(buttons).toHaveLength(mockSlidesLength)

      // Assert each button is rendered with its necessary information
      buttons.forEach((button, index) => {
        // Assert the button is rendered
        expect(button.exists()).toBeTruthy()

        // Assert the "aria-label" has the correct value
        expect(button.attributes('aria-label')).toBe(`Slide ${index + 1}`)

        // Assert the "title" has the correct value
        expect(button.attributes('title')).toBe(`Display slide ${index + 1}`)

        // Assert the button is completely black when active and empty when inactive
        expect(button.classes('slideshow__slick-slider-button--active')).toBe(
          index === mockActiveIndex,
        )
      })
    })

    test('renders the autoration toggle button with necessary information', () => {
      const button = wrapper.find("[data-testid='slideshow__autorotation-button']")
      const icon = wrapper.find("[data-testid='icon-pause']")

      // Assert the button is rendered
      expect(button.exists()).toBeTruthy()

      // Assert the "pause" icon is rendered
      expect(icon.exists()).toBeTruthy()

      // Assert the "pause" icon doesn't exist for screen readers
      expect(icon.attributes('aria-hidden')).toBe('true')

      // Assert the title is rendered with the correct value
      expect(button.attributes('title')).toBe('Stop the slide show')

      // Assert the "aria-label" is rendered with the correct value
      expect(button.attributes('aria-label')).toBe('Stop automatic slide show')
    })
  })

  describe('Playing state is false - Reduce motion state is false', () => {
    test('renders the autoration toggle button with necessary information', async () => {
      // Find elements
      const button = wrapper.find("[data-testid='slideshow__autorotation-button']")

      // Click the 'pause' button to display the 'play' button
      await button.trigger('click')

      // Assert the "play" icon is rendered
      const icon = wrapper.find("[data-testid='icon-play']")
      expect(icon.exists()).toBeTruthy()

      // Assert the "play" icon doesn't exist for screen readers
      expect(icon.attributes('aria-hidden')).toBe('true')

      // Assert the title is rendered with the correct value
      expect(button.attributes('title')).toBe('Start the slide show')

      // Assert the "aria-label" is rendered with the correct value
      expect(button.attributes('aria-label')).toBe('Start automatic slide show')
    })
  })

  describe('Behaviors:', () => {
    /*************/
    /* Slideshow */
    /*************/

    test('the slideshow autorotation is playing by default', () => {
      // Assert the pause icon is rendered
      const icon = wrapper.find("[data-testid='icon-pause']")
      expect(icon.exists()).toBeTruthy()
    })

    test(
      'slideshow renders automatically each slide until achieving 1 loop',
      async () => {
        // Find the slides
        const HeroSlideComponents = wrapper.findAllComponents(HeroSlide)

        // Assert each slide is rendered
        for (let index = 0; index < HeroSlideComponents.length; index++) {
          // Wait 3.8 seconds except for the last slide (Delay between two slides)
          await new Promise((resolve) => setTimeout(resolve, 3800))

          // Assert the slide is rendered
          expect(
            HeroSlideComponents[
              index === HeroSlideComponents.length - 1 ? 0 : index + 1
            ].isVisible(),
          ).toBeTruthy()
        }
      },
      3800 * mockSlidesLength + 1000,
    )

    test('when the user has the reduce motion activated, the autorotation should be pause at initial render', async () => {
      // Enable the reduce motion feature to block animations
      mockIsReducedMotionStore.isReducedMotion = true

      // Mount the component with the reduce motion feature updated
      wrapper = mountSlideshow()

      const HeroSlideComponents = wrapper.findAllComponents(HeroSlide)
      const FirstHeroSlideComponent = HeroSlideComponents[0]

      // Assert the first/starting slide is showned at initial render
      expect(FirstHeroSlideComponent.isVisible()).toBeTruthy()

      // Wait 3.8 seconds (Delay between two slides)
      await new Promise((resolve) => setTimeout(resolve, 3800))

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

      // Wait 3.8 seconds (Delay between two slides)
      await new Promise((resolve) => setTimeout(resolve, 3800))

      // Assert the autorotation is on by asserting that the second/last slide is rendered
      expect(SecondHeroSlideComponent.isVisible()).toBeTruthy()

      // Hover the slideshow
      await slideShow.trigger('mouseenter')

      // Wait 3.8 seconds (Delay between two slides)
      await new Promise((resolve) => setTimeout(resolve, 3800))

      // Assert the autorotation has been stopped by asserting that the second/last slide is still rendered
      expect(SecondHeroSlideComponent.isVisible()).toBeTruthy()

      // Mouse leaves the slideshow
      await slideShow.trigger('mouseleave')

      // Wait 3.8 seconds (Delay between two slides)
      await new Promise((resolve) => setTimeout(resolve, 3800))

      // Assert the autorotation has resume by asserting that the next (first/starting) slide is rendered
      expect(FirstHeroSlideComponent.isVisible()).toBeTruthy()
    }, 12000)

    test('when a slide element is focused and the mouse leaves the slideshow, the auto-rotation button should remain paused', async () => {
      const slideShow = wrapper.find("[data-testid='slideshow']")
      const FirstHeroSlideComponent = wrapper.findComponent(HeroSlide)
      const FirstHeroSlideLink = FirstHeroSlideComponent.find("[data-testid='hero__slide-link']")

      // Assert the first/starting slide is showned at initial render
      expect(FirstHeroSlideComponent.isVisible()).toBeTruthy()

      // Focus the active slide link (button)
      FirstHeroSlideLink.element.focus() // this method guarantee that the DOM element will be focused
      expect(document.activeElement).toStrictEqual(FirstHeroSlideLink.element) // assert the element is well focused

      // Mouse leaves the slideshow
      await slideShow.trigger('mouseleave')

      // Wait 3.8 seconds (Delay between two slides)
      await new Promise((resolve) => setTimeout(resolve, 3800))

      // Assert the first/starting slide is still showned
      expect(FirstHeroSlideComponent.isVisible()).toBeTruthy()
    })

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

    test('renders each previous slide by left swipe', async () => {
      // Find the elements
      const slideShow = wrapper.find("[data-testid='slideshow']")
      const HeroSlideComponents = wrapper.findAllComponents(HeroSlide)

      // Display the last slide to prevent desynchronization between the loop index and the internal deferredActiveIndex state
      await slideShow.trigger('touchstart', {
        changedTouches: [{ screenX: 100 }],
      })
      await slideShow.trigger('touchend', {
        changedTouches: [{ screenX: 10 }],
      })

      // Assert each slide is rendered
      for (let index = HeroSlideComponents.length - 1; index >= 0; index--) {
        // Swipe left
        await slideShow.trigger('touchstart', {
          changedTouches: [{ screenX: 100 }],
        })
        await slideShow.trigger('touchend', {
          changedTouches: [{ screenX: 10 }],
        })

        // Wait 0.2 seconds (Slick slider A11y trick)
        await new Promise((resolve) => setTimeout(resolve, 200))

        // Assert the previous slide is rendered
        expect(
          HeroSlideComponents[index === 0 ? HeroSlideComponents.length - 1 : index - 1].isVisible(),
        ).toBeTruthy()
      }
    })

    test('renders each next slide by right swipe', async () => {
      // Find the elements
      const slideShow = wrapper.find("[data-testid='slideshow']")
      const HeroSlideComponents = wrapper.findAllComponents(HeroSlide)

      // Assert each slide is rendered
      for (let index = 0; index < HeroSlideComponents.length; index++) {
        // Swipe right
        await slideShow.trigger('touchstart', {
          changedTouches: [{ screenX: 10 }],
        })
        await slideShow.trigger('touchend', {
          changedTouches: [{ screenX: 100 }],
        })

        // Wait 0.2 seconds (Slick slider A11y trick)
        await new Promise((resolve) => setTimeout(resolve, 200))

        // Assert the next slide is rendered
        expect(
          HeroSlideComponents[index === HeroSlideComponents.length - 1 ? 0 : index + 1].isVisible(),
        ).toBeTruthy()
      }
    })

    /******************************/
    /* Autorotation toggle button */
    /******************************/

    test('when the autorotation toggle button is clicked, it stops and starts the slideshow autorotation', async () => {
      // Find the button
      const button = wrapper.find("[data-testid='slideshow__autorotation-button']")

      // Click the button
      await button.trigger('click')

      // Wait 3.8 seconds (Delay between two slides)
      await new Promise((resolve) => setTimeout(resolve, 3800))

      // Assert the autorotation is stopped
      const FirstHeroSlideComponent = wrapper.findComponent(HeroSlide)
      expect(FirstHeroSlideComponent.isVisible()).toBeTruthy()

      // Click the 'play' button to start again the autorotation
      await button.trigger('click')

      // Wait 3.8 seconds (Delay between two slides)
      await new Promise((resolve) => setTimeout(resolve, 3800))

      // Assert the autorotation is playing
      const HeroSlideComponents = wrapper.findAllComponents(HeroSlide)
      const SecondHeroSlideComponent = HeroSlideComponents[1]
      expect(SecondHeroSlideComponent.isVisible()).toBeTruthy()
    }, 8000)

    test('when the autorotation toggle button is touched, it stops and starts the slideshow autorotation', async () => {
      // Find the button
      const button = wrapper.find("[data-testid='slideshow__autorotation-button']")

      // Touch the button
      await button.trigger('touchstart')
      await button.trigger('touchend')

      // Wait 3.8 seconds (Delay between two slides)
      await new Promise((resolve) => setTimeout(resolve, 3800))

      // Assert the autorotation is stopped
      const FirstHeroSlideComponent = wrapper.findComponent(HeroSlide)
      expect(FirstHeroSlideComponent.isVisible()).toBeTruthy()

      // Touch the 'play' button to start again the autorotation
      await button.trigger('touchstart')
      await button.trigger('touchend')

      // Wait 3.8 seconds (Delay between two slides)
      await new Promise((resolve) => setTimeout(resolve, 3800))

      // Assert the autorotation is playing
      const HeroSlideComponents = wrapper.findAllComponents(HeroSlide)
      const SecondHeroSlideComponent = HeroSlideComponents[1]
      expect(SecondHeroSlideComponent.isVisible()).toBeTruthy()
    }, 8000)

    test('when a user resumes the slideshow autorotation, hover are ignored', async () => {
      const HeroSlideComponents = wrapper.findAllComponents(HeroSlide)
      const FirstHeroSlideComponent = HeroSlideComponents[0]
      const SecondHeroSlideComponent = HeroSlideComponents[1]
      const autorotationButton = wrapper.find("[data-testid='slideshow__autorotation-button']")

      // Assert the first/starting slide is rendered
      expect(FirstHeroSlideComponent.isVisible()).toBeTruthy()

      // Pause the slideshow autorotation
      await autorotationButton.trigger('click')

      // Wait 3.8 seconds (Delay between two slides)
      await new Promise((resolve) => setTimeout(resolve, 3800))

      // Assert the slideshow is paused
      expect(FirstHeroSlideComponent.isVisible()).toBeTruthy()

      // Resume the slideshow autorotation
      await autorotationButton.trigger('click')

      // Wait 3.8 seconds (Delay between two slides)
      await new Promise((resolve) => setTimeout(resolve, 3800))

      // Assert the slideshow is resumed
      expect(SecondHeroSlideComponent.isVisible()).toBeTruthy()
    }, 8000)

    test('when a user resumes the slideshow autorotation, element focus stops autorotation', async () => {
      const HeroSlideComponents = wrapper.findAllComponents(HeroSlide)
      const FirstHeroSlideComponent = HeroSlideComponents[0]
      const SecondHeroSlideComponent = HeroSlideComponents[1]
      const autorotationButton = wrapper.find("[data-testid='slideshow__autorotation-button']")

      // Assert the first/starting slide is rendered
      expect(FirstHeroSlideComponent.isVisible()).toBeTruthy()

      // Pause the slideshow autorotation
      await autorotationButton.trigger('click')

      // Wait 3.8 seconds (Delay between two slides)
      await new Promise((resolve) => setTimeout(resolve, 3800))

      // Assert the slideshow is paused
      expect(FirstHeroSlideComponent.isVisible()).toBeTruthy()

      // Resume the slideshow autorotation
      await autorotationButton.trigger('click')

      // Wait 3.8 seconds (Delay between two slides)
      await new Promise((resolve) => setTimeout(resolve, 3800))

      // Assert the slideshow is resumed
      expect(SecondHeroSlideComponent.isVisible()).toBeTruthy()

      // Focus the first slick slider button
      const firstSlickSliderButton = wrapper.find("[data-testid='slideshow__slick-slider-button']")
      firstSlickSliderButton.element.focus()
      expect(document.activeElement).toStrictEqual(firstSlickSliderButton.element) // assert the element is well focused

      // Wait 3.8 seconds (Delay between two slides)
      await new Promise((resolve) => setTimeout(resolve, 3800))

      // Assert the slideshow is paused
      expect(SecondHeroSlideComponent.isVisible()).toBeTruthy()
    }, 12000)

    test('when the autoration toggle button is focused, it allows screen readers to read slides', async () => {
      // Focused the pause button
      const button = wrapper.find("[data-testid='slideshow__autorotation-button']")
      await button.trigger('focus')

      // Assert the screen readers are allowed to read slides
      const slidesElement = wrapper.find("[data-testid='slideshow__slides']")
      expect(slidesElement.attributes('aria-live')).toBe('polite')
    })

    test('when the autoration toggle button is focusout, it disallows screen readers to read slides', async () => {
      // Focused the pause button
      const button = wrapper.find("[data-testid='slideshow__autorotation-button']")
      await button.trigger('blur')

      // Assert the screen readers are disallowed to read slides
      const slidesElement = wrapper.find("[data-testid='slideshow__slides']")
      expect(slidesElement.attributes('aria-live')).toBe('off')
    })

    /************************/
    /* Slick slider buttons */
    /************************/

    test('when each slick slider button is clicked, it displays its slide', async () => {
      // Find the elements
      const buttons = wrapper.findAll("[data-testid='slideshow__slick-slider-button']")
      const HeroSlideComponents = wrapper.findAllComponents(HeroSlide)

      // Assert each button renders its corresponding slide
      for (let index = 0; index < buttons.length; index++) {
        // Click the button
        await buttons[index].trigger('click')

        // Wait 0.2 seconds (Slick slider A11y trick)
        await new Promise((resolve) => setTimeout(resolve, 200))

        // Assert the corresponding slide is rendered
        expect(HeroSlideComponents[index].isVisible()).toBeTruthy()
      }
    })

    test('when a slick slider button is touched, nothing happen', async () => {
      // Find the elements
      const buttons = wrapper.findAll("[data-testid='slideshow__slick-slider-button']")
      const HeroSlideComponents = wrapper.findAllComponents(HeroSlide)

      // Touch the next button
      await buttons[1].trigger('touchstart', {
        changedTouches: [{ screenX: 10 }],
      })
      await buttons[1].trigger('touchend', {
        changedTouches: [{ screenX: 10 }],
      })

      // Assert its corresponding slide is not rendered
      expect(HeroSlideComponents[1].isVisible()).toBeFalsy()
    })

    test('when the left arrow key is pressed on each slideshow slick slider button, it displays the previous slide', async () => {
      // Find the elements
      const buttons = wrapper.findAll("[data-testid='slideshow__slick-slider-button']")
      const HeroSlideComponents = wrapper.findAllComponents(HeroSlide)

      // Display the last slide to prevent desynchronization between the loop index and the internal activeIndex state
      await buttons[buttons.length - 1].trigger('keydown', {
        key: 'ArrowLeft',
        code: 'ArrowLeft',
      })

      // Wait 0.2 seconds (Slick slider A11y trick)
      await new Promise((resolve) => setTimeout(resolve, 200))

      // Assert the last slide is rendered
      expect(HeroSlideComponents[mockSlidesLength - 1].attributes('class')).toContain(
        'slideshow__slide--active',
      )

      // Assert each button renders its corresponding slide
      for (let index = buttons.length - 1; 0 >= index; index--) {
        // Press the left arrow key
        await buttons[index].trigger('keydown', {
          key: 'ArrowLeft',
          code: 'ArrowLeft',
        })

        // Wait 0.2 seconds (Slick slider A11y trick)
        await new Promise((resolve) => setTimeout(resolve, 200))

        // Assert the corresponding slide is rendered
        expect(
          HeroSlideComponents[index === 0 ? mockSlidesLength - 1 : index - 1].isVisible(),
        ).toBeTruthy()
      }
    })

    test('when the right arrow key is pressed on each slideshow slick slider button, it displays the next slide', async () => {
      // Find the elements
      const buttons = wrapper.findAll("[data-testid='slideshow__slick-slider-button']")
      const HeroSlideComponents = wrapper.findAllComponents(HeroSlide)

      // Assert each button renders its corresponding slide
      for (let index = 0; index < buttons.length; index++) {
        // Press the right arrow key
        await buttons[index].trigger('keydown', {
          key: 'ArrowRight',
          code: 'ArrowRight',
        })

        // Wait 0.2 seconds (Slick slider A11y trick)
        await new Promise((resolve) => setTimeout(resolve, 200))

        // Assert the corresponding slide is rendered
        expect(
          HeroSlideComponents[index === mockSlidesLength - 1 ? 0 : index + 1].isVisible(),
        ).toBeTruthy()
      }
    })

    test('when the home key is pressed on each slideshow slick slider button, it displays the first slide, and the first slick slider button is focused', async () => {
      // Find the buttons
      const buttons = wrapper.findAll("[data-testid='slideshow__slick-slider-button']")
      const HeroSlideComponents = wrapper.findAllComponents(HeroSlide)
      const FirstHeroSlideComponent = HeroSlideComponents[0]

      // Focus the first slick slider button to let the component fill KeyboardNavigation with "true"
      buttons[0].element.focus()
      expect(document.activeElement).toBe(buttons[0].element)

      // Assert the first slide is rendered
      expect(FirstHeroSlideComponent.isVisible()).toBeTruthy()

      // Assert each button will renders the first slide
      for (let index = 0; index < buttons.length; index++) {
        // Initialize slick slider position
        buttons[index].element.click()
        await nextTick()

        // Wait 0.2 seconds (Slick slider A11y trick)
        await new Promise((resolve) => setTimeout(resolve, 200))

        // Assert the slide is rendered
        expect(HeroSlideComponents[index].isVisible()).toBeTruthy()

        // Assert the slick slider button is focused
        expect(document.activeElement).toBe(buttons[index].element)

        // Press the "home" key to comeback and display the first slide
        await buttons[index === mockSlidesLength - 1 ? 0 : index + 1].trigger('keydown', {
          key: 'Home',
          code: 'Home',
        })

        // Wait 0.2 seconds (Slick slider A11y trick)
        await new Promise((resolve) => setTimeout(resolve, 200))

        // Assert the first slide is rendered
        expect(FirstHeroSlideComponent.isVisible()).toBeTruthy()

        // Assert the first slick slider button is focused
        expect(document.activeElement).toBe(buttons[0].element)
      }
    })

    test('when the end key is pressed on each slideshow slick slider button, it displays the last slide, and the last slick slider button is focused', async () => {
      // Find the buttons
      const buttons = wrapper.findAll("[data-testid='slideshow__slick-slider-button']")
      const HeroSlideComponents = wrapper.findAllComponents(HeroSlide)
      const FirstHeroSlideComponent = HeroSlideComponents[0]
      const LastHeroSlideComponent = HeroSlideComponents[HeroSlideComponents.length - 1]

      // Focus the first slick slider button to let the component fill KeyboardNavigation with "true"
      buttons[0].element.focus()
      expect(document.activeElement).toBe(buttons[0].element)

      // Assert the first slide is rendered
      expect(FirstHeroSlideComponent.isVisible()).toBeTruthy()

      // Assert each button will renders the last slide
      for (let index = 0; index < buttons.length; index++) {
        // Initialize slick slider position
        buttons[index].element.click()
        await nextTick()

        // Wait 0.2 seconds (Slick slider A11y trick)
        await new Promise((resolve) => setTimeout(resolve, 200))

        // Assert the slide is rendered
        expect(HeroSlideComponents[index].isVisible()).toBeTruthy()

        // Assert the slick slider button is focused
        expect(document.activeElement).toBe(buttons[index].element)

        // Press the "end" key
        await buttons[index].trigger('keydown', {
          key: 'End',
          code: 'End',
        })

        // Wait 0.2 seconds (Slick slider A11y trick)
        await new Promise((resolve) => setTimeout(resolve, 200))

        // Assert the last slide is rendered
        expect(LastHeroSlideComponent.isVisible()).toBeTruthy()

        // Assert the last slick slider button is focused
        expect(document.activeElement).toBe(buttons[buttons.length - 1].element)
      }
    })

    test("when user focus a slick slider button, the autorotation is stopped, then start again when the 'play' button is clicked", async () => {
      const HeroSlideComponents = wrapper.findAllComponents(HeroSlide)
      const FirstHeroSlideComponent = HeroSlideComponents[0]
      const SecondHeroSlideComponent = HeroSlideComponents[1]

      // Assert the first/starting slide is rendered
      expect(FirstHeroSlideComponent.isVisible()).toBeTruthy()

      // Focus the first slick slider button
      const slickSliderButton = wrapper.find("[data-testid='slideshow__slick-slider-button']")
      slickSliderButton.element.focus()

      // Wait 3.8 seconds (Delay between two slides)
      await new Promise((resolve) => setTimeout(resolve, 3800))

      // Assert carousel playing has been stopped
      expect(FirstHeroSlideComponent.isVisible()).toBeTruthy()

      // Click the "play" button
      const autorotationButton = wrapper.find("[data-testid='slideshow__autorotation-button']")
      await autorotationButton.trigger('click')

      // Wait 3.8 seconds (Delay between two slides)
      await new Promise((resolve) => setTimeout(resolve, 3800))

      // Assert carousel playing has been stopped
      expect(SecondHeroSlideComponent.isVisible()).toBeTruthy()
    }, 7700)
  })
})
