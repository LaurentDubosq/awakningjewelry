import { mount } from '@vue/test-utils'
import { beforeEach } from 'vitest'
import HeroSlide from '@/components/HeroSlide.vue'
import frontDataBase from '../../../db.json'
import router from '@/router'

/**************/
/* 1.Hoisting */
/**************/

// Mock the "getPagesMetaData" data fetcher used in the mocked router
vi.mock('@/data/dataFetchers', () => {
  return {
    getPagesMetaData: vi.fn().mockReturnValue(undefined),
  }
})

/********************/
/* 2.Initialization */
/********************/

const mockSlide = frontDataBase.heroSlides[0]
const mockSlideSubtitle = mockSlide.subtitle
const mockSlideTitle = mockSlide.title
const mockSlideLinkURL = mockSlide.url
const mockSlideImageAlt = mockSlide.images.alt
const mockSlideImageMobileURL = mockSlide.images.mobile.url
const mockSlideImageDesktopURL = mockSlide.images.desktop.url

/***********/
/* 3.Build */
/***********/

// Component Factory
function mountHeroSlide() {
  return mount(HeroSlide, {
    props: {
      slide: mockSlide,
      slidesLength: 1,
      slideIndex: 0,
      isActive: true,
    },
    global: {
      plugins: [router],
    },
  })
}

/**********/
/* 4.Test */
/**********/

describe('HeroSlide.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mountHeroSlide()
  })

  // Smoke test
  test('mounts successfully', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  test('renders the slide with necessary information', () => {
    const img = wrapper.find("[data-testid='hero__slide-image']")
    const source = wrapper.find("[data-testid='hero__slide-image-desktop']")
    const subtitle = wrapper.find("[data-testid='hero__slide-subtitle']")
    const title = wrapper.find("[data-testid='hero__slide-title']")
    const link = wrapper.find("[data-testid='hero__slide-link']")

    // Assert the mobile image is rendered
    expect(img.exists()).toBeTruthy()

    // Assert the mobile image has its "src" value well setted
    expect(img.attributes('src')).toBe(mockSlideImageMobileURL)

    // Assert the mobile image has its "alt" value well setted
    expect(img.attributes('alt')).toBe(mockSlideImageAlt)

    // Assert the dekstop image is mounted in the DOM
    expect(source.exists()).toBeTruthy()

    // Assert the desktop image has its "srcset" value well setted
    expect(source.attributes('srcset')).toBe(mockSlideImageDesktopURL)

    // Assert the subtitle is rendered
    expect(subtitle.text()).toContain(mockSlideSubtitle)

    // Assert the title is rendered
    expect(title.text()).toContain(mockSlideTitle)

    // Assert the button/link is rendered
    expect(link.exists()).toBeTruthy()

    // Assert the button/link "href" value is well setted
    expect(link.attributes('href')).toContain(mockSlideLinkURL)
  })
})
