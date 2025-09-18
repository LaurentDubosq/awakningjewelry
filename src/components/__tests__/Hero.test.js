import { computed, defineComponent, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import Hero from '@/components/Hero.vue'
import HeroSlide from '@/components/HeroSlide.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import frontDataBase from '../../../db.json'
import { defineStore } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'

/**************/
/* 1.Hoisting */
/**************/

// Mock the "useGetClientHeightAtElementResize" composable
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
const mockHeroSlidesPending = {
  slides: undefined,
  slidesFetchState: 'pending',
}
const mockHeroSlidesRejected = {
  slides: undefined,
  slidesFetchState: 'rejected',
}
const mockHeroSlidesFulfilled = {
  slides: frontDataBase.heroSlides,
  slidesFetchState: 'fulfilled',
}
const mockHeroSlides = mockHeroSlidesFulfilled.slides
const mockHeroSlidesLength = mockHeroSlides.length
const mockActiveIndex = 0 // mock of the activeIndex internal state

/* Stores */

// Initialize a testing pinia instance
const mockPinia = createTestingPinia()

// Create the stores
const mockUseHeroSlidesStore = defineStore('HeroSlides', () => {
  const fetchResult = ref(mockHeroSlidesPending)
  const heroSlides = computed(() => fetchResult.value?.slides)
  const heroSlidesLength = computed(() => heroSlides.value?.length)
  const heroSlidesFetchState = computed(() => fetchResult.value?.slidesFetchState)
  return { fetchResult, heroSlides, heroSlidesLength, heroSlidesFetchState }
})

const mockUseIsReducedMotionStore = defineStore('IsReducedMotion', () => {
  const isReducedMotion = ref(false)
  return { isReducedMotion }
})

const mockUseIsOnMobileStore = defineStore('IsOnMobile', () => {
  const isOnMobile = ref()
  return { isOnMobile }
})

// Initialize the stores
const mockHeroSlidesStore = mockUseHeroSlidesStore()
const mockIsReducedMotionStore = mockUseIsReducedMotionStore()
mockUseIsOnMobileStore()

/***********/
/* 3.Build */
/***********/

// Component Factory (Data fetching "Pending" state - Slideshow playing state is true - Reduce motion state is false)
const mountHero = () => {
  return mount(Hero, {
    attachTo: document.body,
    global: {
      plugins: [mockRouter, mockPinia],
    },
  })
}

/**********/
/* 4.Test */
/**********/

// WARNING : The component has 3 states regarding the data fetching state. "Pending", "Rejected" and "Fulfilled". The state by default is "Pending".

// WARNING : The component has 2 states regarding the slideshow playing state. True or false. The state by default is true.

// WARNING : The component has 2 states regarding the reduce motion state. True or false. The state by default is false.

describe('Hero.vue', () => {
  let wrapper

  beforeEach(() => {
    // Mount the component (Data fetching "Pending" state - Slideshow playing state is true - Reduce motion state is false)
    wrapper = mountHero()
  })

  afterEach(() => {
    // Reset the store(s) state(s) to default to ensure a clean environment for each test
    mockHeroSlidesStore.fetchResult = mockHeroSlidesPending
    mockIsReducedMotionStore.isReducedMotion = false
  })

  // Smoke test
  test('mounts successfully', async () => {
    // Assert the wrapper component is well mounted at initial render
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('Initial render - Data fetching "Pending" state', () => {
    test('the loader animation is rendered', async () => {
      const loadingComponent = wrapper.findComponent(LoadingComponent)
      expect(loadingComponent.exists()).toBeTruthy()
    })
  })

  describe('Data fetching "Rejected" state', () => {
    test('the error message is rendered', async () => {
      // Set the store data fetching state to rejected
      mockHeroSlidesStore.fetchResult = mockHeroSlidesRejected
      await nextTick()

      // Assert the error message is rendered
      const errorComponent = wrapper.findComponent(ErrorComponent)
      expect(errorComponent.exists()).toBeTruthy()
    })
  })

  describe('Data fetching "Fulfilled" state - Slideshow playing state is true - Reduce motion state is false', async () => {
    beforeEach(async () => {
      // Set the store data fetching state to fulfilled
      mockHeroSlidesStore.fetchResult = mockHeroSlidesFulfilled
      await nextTick()
    })

    test('renders the feature accessibility label', () => {
      const section = wrapper.find("[data-testid='hero']")
      expect(section.attributes('aria-label')).toContain('Highlighted product categories')
    })

    test('the slides are rendered', () => {
      // Assert all the expected slides are rendered
      const slides = wrapper.findAll("[data-testid='hero__slide']")
      expect(slides).toHaveLength(mockHeroSlidesLength)

      // Assert each slide is rendered with its necessary information
      slides.forEach((slide, index) => {
        const a11yLabel = slide.find("[data-testid='hero__slide-a11y-label']")
        const img = slide.find("[data-testid='hero__slide-image']")
        const sourceMobileLandscape = slide.find(
          "[data-testid='hero__slide-image-mobile-landscape']",
        )
        const sourceDesktop = slide.find("[data-testid='hero__slide-image-desktop']")
        const sourceDesktopLarge = slide.find("[data-testid='hero__slide-image-desktop-large']")
        const subtitle = slide.find("[data-testid='hero__slide-subtitle']")
        const title = slide.find("[data-testid='hero__slide-title']")
        const link = slide.find("[data-testid='hero__slide-link']")

        const mockSlide = mockHeroSlides[index]
        const mockA11yLabel = `Slide ${index + 1} of ${mockHeroSlidesLength}`
        const mockSlideImageMobileURL = mockSlide.images.mobile
        const mockSlideImageMobileLandscapeURL = mockSlide.images.mobileLandscape
        const mockSlideImageDesktopURL = mockSlide.images.desktop
        const mockSlideImageDesktopLargeURL = mockSlide.images.desktopLarge
        const mockSlideImageAlt = mockSlide.imageAlt
        const mockSlideSubtitle = mockSlide.subtitle
        const mockSlideTitle = mockSlide.title
        const mockSlideLinkURL = mockSlide.url

        // Assert the accessible name is rendered
        expect(a11yLabel.text()).toContain(mockA11yLabel)

        // Assert the mobile image is rendered
        expect(img.exists()).toBeTruthy()

        // Assert the mobile image has its "src" value well setted
        expect(img.attributes('src')).toBe(mockSlideImageMobileURL)

        // Assert the mobile image has its "alt" value well setted
        expect(img.attributes('alt')).toBe(mockSlideImageAlt)

        // Assert the mobile landscape image is rendered
        expect(sourceMobileLandscape.exists()).toBeTruthy()
        expect(sourceMobileLandscape.attributes('srcset')).toBe(mockSlideImageMobileLandscapeURL)

        // Assert the desktop image is rendered
        expect(sourceDesktop.exists()).toBeTruthy()
        expect(sourceDesktop.attributes('srcset')).toBe(mockSlideImageDesktopURL)

        // Assert the desktop large image is rendered
        expect(sourceDesktopLarge.exists()).toBeTruthy()
        expect(sourceDesktopLarge.attributes('srcset')).toBe(mockSlideImageDesktopLargeURL)

        // Assert the subtitle is rendered
        expect(subtitle.text()).toContain(mockSlideSubtitle)

        // Assert the title is rendered
        expect(title.text()).toContain(mockSlideTitle)

        // Assert the link(button) is rendered
        expect(link.exists()).toBeTruthy()

        // Assert the link(button) has the correct url
        expect(link.attributes('href')).toBe(mockSlideLinkURL)
      })
    })

    test('renders the slick slider accessibility name', () => {
      const div = wrapper.find("[data-testid='slideshow__slick-slider']")
      expect(div.attributes('aria-label')).toContain('Manual slideshow navigation')
    })

    test('render all the slick slider buttons with their necessary information', () => {
      const buttons = wrapper.findAll("[data-testid='slideshow__slick-slider-button']")

      // Assert all the buttons are rendered
      expect(buttons).toHaveLength(mockHeroSlidesLength)

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

    describe('Initial render - Playing state is true - Reduce motion state is false', () => {
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
        3800 * mockHeroSlidesLength + 1000,
      )

      test('when the user has the reduce motion activated, the slideshow autorotation should be pause at initial render', async () => {
        // Enable the reduce motion feature to block animations
        mockIsReducedMotionStore.isReducedMotion = true
        await nextTick()

        // Find the element
        const FirstHeroSlideComponent = wrapper.findComponent(HeroSlide)

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
        const ThirdHeroSlideComponent = HeroSlideComponents[2]

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
        expect(ThirdHeroSlideComponent.isVisible()).toBeTruthy()
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

      test("when user navigates using the 'tab' key, the first focusable element should be the autorotation button", async () => {
        /* As the "tab" key doesn't move the focus using vue test utils, we prefere to check the focusable element position by their order */

        // Get the first focusable element
        const focusableElement = wrapper.find(
          'button, input, select, textarea, a[href], area, iframe, object, embed, details, audio, video, [tabindex="0"]',
        )

        // Assert the autorotation button is the first focusable element
        const button = wrapper.find("[data-testid='slideshow__autorotation-button']")
        expect(focusableElement.element).toBe(button.element)
      })

      test("when user navigates using the 'tab' key, the slick slider should be registered before the slide content in the tab sequence", () => {
        /* As the "tab" key doesn't move the focus using vue test utils, we prefere to check the focusable element position by their order */

        // Get all the focusable elements
        const focusableElements = wrapper
          .findAll(
            'button, input, select, textarea, a, area, iframe, object, embed, details, audio, video, [tabindex="0"]',
          )
          .map((e) => e.element)

        // Get the slick slider first button position
        const firstSlickSliderButton = wrapper.find(
          "[data-testid='slideshow__slick-slider-button']",
        )
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

        // Display the last slide to prevent desynchronization between the loop index and the internal activeIndex state
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
            HeroSlideComponents[
              index === 0 ? HeroSlideComponents.length - 1 : index - 1
            ].isVisible(),
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
            HeroSlideComponents[
              index === HeroSlideComponents.length - 1 ? 0 : index + 1
            ].isVisible(),
          ).toBeTruthy()
        }
      })

      /******************************/
      /* Autorotation toggle button */
      /******************************/

      test('when the slideshow autorotation toggle button is clicked, it stops and starts the slideshow autorotation', async () => {
        // Click the button
        const button = wrapper.find("[data-testid='slideshow__autorotation-button']")
        await button.trigger('click')

        // Wait 3.8 seconds (Delay between two slides)
        await new Promise((resolve) => setTimeout(resolve, 3800))

        // Assert the first/starting slide is still rendered
        const FirstHeroSlideComponent = wrapper.findComponent(HeroSlide)
        expect(FirstHeroSlideComponent.isVisible()).toBeTruthy()

        // Click the 'play' button to start again the autorotation
        await button.trigger('click')

        // Wait 3.8 seconds (Delay between two slides)
        await new Promise((resolve) => setTimeout(resolve, 3800))

        // Assert the second slide is rendered
        const HeroSlideComponents = wrapper.findAllComponents(HeroSlide)
        const SecondHeroSlideComponent = HeroSlideComponents[1]
        expect(SecondHeroSlideComponent.isVisible()).toBeTruthy()
      }, 8000)

      test('when the slideshow autorotation toggle button is touched, it stops and starts the slideshow autorotation', async () => {
        // Touch the button
        const button = wrapper.find("[data-testid='slideshow__autorotation-button']")
        await button.trigger('touchstart')
        await button.trigger('touchend')

        // Wait 3.8 seconds (Delay between two slides)
        await new Promise((resolve) => setTimeout(resolve, 3800))

        // Assert the first/starting slide is still rendered
        const FirstHeroSlideComponent = wrapper.findComponent(HeroSlide)
        expect(FirstHeroSlideComponent.isVisible()).toBeTruthy()

        // Touch the 'play' button to start again the autorotation
        await button.trigger('touchstart')
        await button.trigger('touchend')

        // Wait 3.8 seconds (Delay between two slides)
        await new Promise((resolve) => setTimeout(resolve, 3800))

        // Assert the second slide is rendered
        const HeroSlideComponents = wrapper.findAllComponents(HeroSlide)
        const SecondHeroSlideComponent = HeroSlideComponents[1]
        expect(SecondHeroSlideComponent.isVisible()).toBeTruthy()
      }, 8000)

      test('when the autoration toggle button is focused, it allows screen readers to read slides', async () => {
        // Focused the pause button
        const button = wrapper.find("[data-testid='slideshow__autorotation-button']")
        await button.trigger('focus')

        // Assert the screen readers are allowed to read slides
        const slidesElement = wrapper.find("[data-testid='slideshow__slides']")
        expect(slidesElement.attributes('aria-live')).toBe('polite')
      })

      test('when the autoration toggle button is focusout, it disallows screen readers to read slides', async () => {
        // Blur the pause button
        const button = wrapper.find("[data-testid='slideshow__autorotation-button']")
        await button.trigger('blur')

        // Assert the screen readers are disallowed to read slides
        const slidesElement = wrapper.find("[data-testid='slideshow__slides']")
        expect(slidesElement.attributes('aria-live')).toBe('off')
      })

      test('when a user resumes the slideshow autorotation, hover are ignored', async () => {
        const HeroSlideComponents = wrapper.findAllComponents(HeroSlide)
        const FirstHeroSlideComponent = HeroSlideComponents[0]
        const SecondHeroSlideComponent = HeroSlideComponents[1]
        const ThirdHeroSlideComponent = HeroSlideComponents[2]
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

        // Hover the slideshow
        const slideShow = wrapper.find("[data-testid='slideshow']")
        await slideShow.trigger('mouseenter')

        // Wait 3.8 seconds (Delay between two slides)
        await new Promise((resolve) => setTimeout(resolve, 3800))

        // Assert the slideshow is still playing (the next slide is the starting slide)
        expect(ThirdHeroSlideComponent.isVisible()).toBeTruthy()
      }, 12000)

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
        const firstSlickSliderButton = wrapper.find(
          "[data-testid='slideshow__slick-slider-button']",
        )
        firstSlickSliderButton.element.focus()
        expect(document.activeElement).toStrictEqual(firstSlickSliderButton.element) // assert the element is well focused

        // Wait 3.8 seconds (Delay between two slides)
        await new Promise((resolve) => setTimeout(resolve, 3800))

        // Assert the slideshow is paused
        expect(SecondHeroSlideComponent.isVisible()).toBeTruthy()
      }, 12000)

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
          expect(HeroSlideComponents[index].attributes('class')).toContain(
            'slideshow__slide--active',
          )
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
        expect(HeroSlideComponents[1].classes()).not.toContain('slideshow__slide--active')
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
        expect(HeroSlideComponents[mockHeroSlidesLength - 1].attributes('class')).toContain(
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
            HeroSlideComponents[index === 0 ? mockHeroSlidesLength - 1 : index - 1].isVisible(),
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
            HeroSlideComponents[index === mockHeroSlidesLength - 1 ? 0 : index + 1].isVisible(),
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
          expect(HeroSlideComponents[index].attributes('class')).toContain(
            'slideshow__slide--active',
          )

          // Assert the slick slider button is focused
          expect(document.activeElement).toBe(buttons[index].element)

          // Press the "home" key to comeback and display the first slide
          await buttons[index === mockHeroSlidesLength - 1 ? 0 : index + 1].trigger('keydown', {
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
          expect(HeroSlideComponents[index].attributes('class')).toContain(
            'slideshow__slide--active',
          )

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
})
