import { mount, RouterLinkStub } from '@vue/test-utils'
import { beforeEach } from 'vitest'
import HeroSlide from '@/components/HeroSlide.vue'
import frontDataBase from '../../../db.json'

/********************/
/* 1.Initialization */
/********************/

const mockSlide = frontDataBase.heroSlides[0]
const mockSlideSubtitle = mockSlide.subtitle
const mockSlideTitle = mockSlide.title
const mockSlideLinkURL = mockSlide.url
const mockSlideImageAlt = mockSlide.images.alt
const mockSlideImageMobileURL = mockSlide.images.mobile.url
const mockSlideImageDesktopURL = mockSlide.images.desktop.url

/***********/
/* 2.Build */
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
      stubs: { RouterLink: RouterLinkStub },
    },
  })
}

/**********/
/* 3.Test */
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
    const link = wrapper.findComponent(RouterLinkStub)

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

    // Assert the link(button) is rendered
    expect(link.exists()).toBeTruthy()

    // Assert the link(button) has the correct url
    expect(link.props('to')).toContain(mockSlideLinkURL)
  })
})
