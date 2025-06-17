import { mount, RouterLinkStub } from '@vue/test-utils'
import { beforeEach } from 'vitest'
import HeroSlide from '@/components/HeroSlide.vue'
import frontDataBase from '../../../db.json'

/********************/
/* 1.Initialization */
/********************/

const mockSlide = frontDataBase.heroSlides[0]
const mockSlideImageMobileURL = mockSlide.images.mobile
const mockSlideImageMobileLandscapeURL = mockSlide.images.mobileLandscape
const mockSlideImageDesktopURL = mockSlide.images.desktop
const mockSlideImageDesktopLargeURL = mockSlide.images.desktopLarge
const mockSlideImageAlt = mockSlide.images.alt
const mockSlideSubtitle = mockSlide.subtitle
const mockSlideTitle = mockSlide.title
const mockSlideLinkURL = mockSlide.url

/***********/
/* 2.Build */
/***********/

// Component Factory (Neutral environment state)
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

// WARNING : The component has 2 states regarding the environment state. Mobile or desktop. There is none used by default.
// Since environment switching is managed by the HTML itself rather than by Javascript, a single environment configuration
// is sufficient for both states.

describe('HeroSlide.vue', () => {
  let wrapper

  beforeEach(() => {
    // Mount the component (Neutral environment state)
    wrapper = mountHeroSlide()
  })

  // Smoke test
  test('mounts successfully', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  test('renders the slide with necessary information', () => {
    const img = wrapper.find("[data-testid='hero__slide-image']")
    const sourceMobileLandscape = wrapper.find("[data-testid='hero__slide-image-mobile-landscape']")
    const sourceDesktop = wrapper.find("[data-testid='hero__slide-image-desktop']")
    const sourceDesktopLarge = wrapper.find("[data-testid='hero__slide-image-desktop-large']")
    const subtitle = wrapper.find("[data-testid='hero__slide-subtitle']")
    const title = wrapper.find("[data-testid='hero__slide-title']")
    const link = wrapper.findComponent(RouterLinkStub)

    // Assert the mobile image is rendered
    expect(img.exists()).toBeTruthy()

    // Assert the mobile image has its "src" value well setted
    expect(img.attributes('src')).toBe(mockSlideImageMobileURL)

    // Assert the mobile image has its "alt" value well setted
    expect(img.attributes('alt')).toBe(mockSlideImageAlt)

    // Assert the mobile landscape image is rendered
    expect(sourceMobileLandscape.exists()).toBeTruthy()
    expect(sourceMobileLandscape.attributes('srcset')).toBe(mockSlideImageMobileLandscapeURL)

    // Assert the dekstop image is rendered
    expect(sourceDesktop.exists()).toBeTruthy()
    expect(sourceDesktop.attributes('srcset')).toBe(mockSlideImageDesktopURL)

    // Assert the dekstop large image is rendered
    expect(sourceDesktopLarge.exists()).toBeTruthy()
    expect(sourceDesktopLarge.attributes('srcset')).toBe(mockSlideImageDesktopLargeURL)

    // Assert the subtitle is rendered
    expect(subtitle.text()).toContain(mockSlideSubtitle)

    // Assert the title is rendered
    expect(title.text()).toContain(mockSlideTitle)

    // Assert the link(button) is rendered
    expect(link.exists()).toBeTruthy()

    // Assert the link(button) has the correct url
    expect(link.props('to')).toBe(mockSlideLinkURL)
  })
})
