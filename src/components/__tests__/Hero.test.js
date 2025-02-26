import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import Hero from '@/components/Hero.vue'
import Slideshow from '@/components/Slideshow.vue'
import HeroSlide from '@/components/HeroSlide.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import useIsReducedMotion from '@/composables/useIsReducedMotion'
import { getHeroSlides } from '@/data/dataFetchers'
import frontDataBase from '../../../db.json'
import router from '@/router'
import { createPinia } from 'pinia'

// Mocks data
const mockHeroSlidesResult = {
  data: frontDataBase.heroSlides,
  status: 'resolved',
}
const mockHeroSlidesData = mockHeroSlidesResult.data
const mockHeroSlidesLength = mockHeroSlidesData.length

// Mock the browsers's resizeObserver API
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock the fetcher used in the get hero slides data
vi.mock('@/data/dataFetchers', () => {
  return {
    getHeroSlides: vi.fn(),
    getPagesMetaData: vi.fn().mockReturnValue(undefined),
  }
})
getHeroSlides.mockReturnValue(mockHeroSlidesResult)

// Mock the useIsReducedMotion composable
vi.mock('@/composables/useIsReducedMotion', () => {
  return {
    default: vi.fn(),
  }
})
useIsReducedMotion.mockReturnValue(ref(false)) // the false value means there is not animation reduction activated. Everything is set to normal.

// Component Factory
function mountHero() {
  return mount(Hero, {
    attachTo: document.body,
    global: {
      plugins: [createPinia(), router],
    },
  })
}

describe('Hero.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mountHero()
  })

  // Smoke test
  test('mounts successfully', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('SlideShow.vue', () => {
    let SlideshowComponent

    beforeEach(() => {
      SlideshowComponent = wrapper.findComponent(Slideshow)
    })

    test('render the component with necessary information', () => {
      // Assert the Slideshow component is rendered
      expect(SlideshowComponent.exists()).toBeTruthy()

      // Assert its "slidesLength" prop value has the correct value
      expect(SlideshowComponent.props('slidesLength')).toMatchObject(mockHeroSlidesLength)
    })

    test('renders all its expected slick slider buttons', () => {
      const slickSliderButtons = wrapper.findAll("[data-testid='slideshow__slick-slider-button']")

      // Assert all its buttons(items) are rendered
      expect(slickSliderButtons).toHaveLength(mockHeroSlidesLength)
    })

    describe('HeroSlide.vue:', () => {
      let HeroSlideComponents

      beforeEach(() => {
        HeroSlideComponents = wrapper.findAllComponents(HeroSlide)
      })

      test('are well rendered as slot content of SlideShow.vue', () => {
        // Assert all the expected HeroSlide component are rendered
        expect(HeroSlideComponents).toHaveLength(mockHeroSlidesLength)

        // Assert each HeroSlide component is rendered with necessary information
        HeroSlideComponents.forEach((HeroSlideComponent, index) => {
          const mockSlide = mockHeroSlidesData[index]

          // Assert the "slide" prop has the correct value
          expect(HeroSlideComponent.props('slide')).toMatchObject(mockSlide)

          // Assert the "slidesLength" prop has the correct value
          expect(HeroSlideComponent.props('slidesLength')).toBe(mockHeroSlidesLength)

          // Assert the "slideIndex" prop has the correct value
          expect(HeroSlideComponent.props('slideIndex')).toBe(index)

          // Assert the "isActive" prop has the correct value
          expect(HeroSlideComponent.props('isActive')).toBe(index === 0)
        })
      })

      test('are well rendered with their data', () => {
        // Assert each slide data are rendered
        HeroSlideComponents.forEach((slide, index) => {
          const img = slide.find("[data-testid='hero__slide-image']")
          const source = slide.find("[data-testid='hero__slide-image-desktop']")
          const subtitle = slide.find("[data-testid='hero__slide-subtitle']")
          const title = slide.find("[data-testid='hero__slide-title']")
          const link = slide.find("[data-testid='hero__slide-link']")
          const mockSlide = frontDataBase.heroSlides[index]
          const mockSlideSubtitle = mockSlide.subtitle
          const mockSlideTitle = mockSlide.title
          const mockSlideLinkURL = mockSlide.url
          const mockSlideImageAlt = mockSlide.images.alt
          const mockSlideImageMobileURL = mockSlide.images.mobile.url
          const mockSlideImageDesktopURL = mockSlide.images.desktop.url

          // Assert the mobile image has its "src" value well setted
          expect(img.attributes('src')).toBe(mockSlideImageMobileURL)

          // Assert the mobile image has its "alt" value well setted
          expect(img.attributes('alt')).toBe(mockSlideImageAlt)

          // Assert the desktop image has its "srcset" value well setted
          expect(source.attributes('srcset')).toBe(mockSlideImageDesktopURL)

          // Assert the subtitle is rendered
          expect(subtitle.text()).toContain(mockSlideSubtitle)

          // Assert the title is rendered
          expect(title.text()).toContain(mockSlideTitle)

          // Assert the button/link "href" value is well setted
          expect(link.attributes('href')).toContain(mockSlideLinkURL)

          // Assert the "slidesLength" prop value is well setted
          expect(slide.props('slidesLength')).toBe(mockHeroSlidesLength)

          // Assert the "index" prop value is well setted
          expect(slide.props('slideIndex')).toBe(index)

          // Assert the "isActive" prop value is well setted
          expect(slide.props('isActive')).toBe(index === 0)
        })
      })
    })
  })

  describe('Behaviors:', () => {
    test("when user clicks on slick slider button of another slide, it renders its corresponding slide (v-slot 'currentIndex' test)", async () => {
      const HeroSlideComponents = wrapper.findAllComponents(HeroSlide)
      const FirstHeroSlideComponent = HeroSlideComponents[0]
      const SecondHeroSlideComponent = HeroSlideComponents[1]
      const slickSliderButtons = wrapper.findAll("[data-testid='slideshow__slick-slider-button']")
      const secondSlickSliderButton = slickSliderButtons[1]

      // Assert the first/starting slide is rendered
      expect(FirstHeroSlideComponent.isVisible()).toBeTruthy()

      // Click on the slick slider button corresponding to the second slide
      await secondSlickSliderButton.trigger('click')

      // Assert the second slide is rendered
      expect(SecondHeroSlideComponent.isVisible()).toBeTruthy()
    })

    test("when the data fetcher status is 'pending', the loading component is rendered", () => {
      // As Hero component has its data fetcher mocked, we have to set its status to "pending" manualy
      mockHeroSlidesResult.status = 'pending'

      // Remount the component to simulate the pending status
      wrapper = mountHero()

      // Assert the loading component is rendered
      const loadingComponent = wrapper.findComponent(LoadingComponent)
      expect(loadingComponent.exists()).toBeTruthy()

      // Reset the mock fetch status to "resolved" for following tests
      mockHeroSlidesResult.status = 'resolved'
    })

    test("when the data fetcher status is 'resolved', its data is rendered", () => {
      // Assert that one of its pieces of data is rendered
      const SlideshowComponent = wrapper.findComponent(Slideshow)
      expect(SlideshowComponent.exists()).toBeTruthy()
    })

    test("when the data fetcher status is 'rejected', the error component is rendered", () => {
      // As Hero component has its data fetcher mocked, we have to set its status to "rejected" manualy
      mockHeroSlidesResult.status = 'rejected'

      // Remount the component to simulate the rejected status
      wrapper = mountHero()

      // Assert the error component is rendered
      const errorComponent = wrapper.findComponent(ErrorComponent)
      expect(errorComponent.exists()).toBeTruthy()

      // Reset the mock fetch status to "resolved" for following tests
      mockHeroSlidesResult.status = 'resolved'
    })
  })
})
