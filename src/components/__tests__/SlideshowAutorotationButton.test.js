import { mount } from '@vue/test-utils'
import SlideshowAutorotationButton from '@/components/SlideshowAutorotationButton.vue'
import IconPause from '@/components/icons/IconPause.vue'
import IconPlay from '@/components/icons/IconPlay.vue'

// Component Factory
const mountSlideshowAutorotationButton = (props = {}) => {
  return mount(SlideshowAutorotationButton, {
    props: { isPlaying: true, ...props },
  })
}

describe('SlideshowAutorotationButton.vue', () => {
  let wrapper

  // Smoke Test
  test('mounts successfully', () => {
    wrapper = mountSlideshowAutorotationButton()
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('Pause Icon Variant', () => {
    beforeEach(() => {
      wrapper = mountSlideshowAutorotationButton()
    })

    test("renders the 'pause' button with necessary information", () => {
      const button = wrapper.find("[data-testid='slideshow__autorotation-button']")
      const IconPauseComponent = wrapper.findComponent(IconPause)

      // Assert the button is rendered
      expect(button.exists()).toBeTruthy()

      // Assert the "pause" icon component is rendered
      expect(IconPauseComponent.exists()).toBeTruthy()

      // Assert the "aria-label" is rendered with the correct value
      expect(button.attributes('aria-label')).toBe('Stop automatic slide show')
    })

    describe('Behaviors:', () => {
      test("when the 'pause' button is clicked, it emits the order to stop the autorotation of the slideshow", async () => {
        // Click the pause button
        const button = wrapper.find("[data-testid='slideshow__autorotation-button']")
        await button.trigger('click')

        // Assert the custom event has been emitted
        expect(wrapper.emitted('stop-autoplay')).toHaveLength(1)
      })
    })
  })

  describe('Play Icon Variant', () => {
    beforeEach(() => {
      wrapper = mountSlideshowAutorotationButton({ isPlaying: false })
    })

    test("renders the 'play' button with necessary information", () => {
      const button = wrapper.find("[data-testid='slideshow__autorotation-button']")
      const IconPlayComponent = wrapper.findComponent(IconPlay)

      // Assert the button is rendered
      expect(button.exists()).toBeTruthy()

      // Assert the "play" icon component is rendered
      expect(IconPlayComponent.exists()).toBeTruthy()

      // Assert the "aria-label" is rendered with the correct value
      expect(button.attributes('aria-label')).toBe('Start automatic slide show')
    })

    describe('Behaviors:', () => {
      test("when the 'play' button is clicked, it emits the order to start the autorotation of the slideshow", async () => {
        // Click the play button
        const button = wrapper.find("[data-testid='slideshow__autorotation-button']")
        await button.trigger('click')

        // Assert the custom event has been emitted
        expect(wrapper.emitted('start-autoplay')).toHaveLength(1)
      })
    })
  })
})
