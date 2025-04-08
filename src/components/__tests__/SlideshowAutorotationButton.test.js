import { mount } from '@vue/test-utils'
import SlideshowAutorotationButton from '@/components/SlideshowAutorotationButton.vue'

/***********/
/* 1.Build */
/***********/

// Component Factory (Playing state is true)
const mountSlideshowAutorotationButton = (props = {}) => {
  return mount(SlideshowAutorotationButton, {
    props: { isPlaying: true, ...props },
  })
}

/**********/
/* 2.Test */
/**********/

// WARNING : The component has 2 states regarding the slideshow playing status. True or false. The state by default is true.

describe('SlideshowAutorotationButton.vue', () => {
  let wrapper

  beforeEach(() => {
    // Component mounting (Playing state is true)
    wrapper = mountSlideshowAutorotationButton()
  })

  // Smoke Test
  test('mounts successfully', () => {
    // Assert the wrapper component is well mounted at initial render
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('Initial render - Playing state is true', () => {
    test('renders the autoration toggle button with necessary information', () => {
      const button = wrapper.find("[data-testid='slideshow__autorotation-button']")
      const icon = wrapper.find("[data-testid='icon-pause']")

      // Assert the button is rendered
      expect(button.exists()).toBeTruthy()

      // Assert the "pause" icon is rendered
      expect(icon.exists()).toBeTruthy()

      // Assert the "aria-label" is rendered with the correct value. A11y exceptional test because there is no text for the button otherwise
      expect(button.attributes('aria-label')).toBe('Stop automatic slide show')
    })
  })

  describe('Playing state is false', () => {
    test('renders the autoration toggle button with necessary information', () => {
      // Component mounting (Playing state is false)
      wrapper = mountSlideshowAutorotationButton({ isPlaying: false })

      // Assert the "play" icon is rendered
      const icon = wrapper.find("[data-testid='icon-play']")
      expect(icon.exists()).toBeTruthy()

      // Assert the "aria-label" is rendered with the correct value. A11y exceptional test because there is no text for the button otherwise
      const button = wrapper.find("[data-testid='slideshow__autorotation-button']")
      expect(button.attributes('aria-label')).toBe('Start automatic slide show')
    })
  })

  describe('Behaviors:', () => {
    test('The autorotation is on by default', () => {
      // Component mounting (autoplay is on)
      const wrapper = mountSlideshowAutorotationButton()

      // Assert the autoplay is on
      const icon = wrapper.find("[data-testid='icon-pause']")
      expect(icon.exists()).toBeTruthy()
    })

    test('when the autoration toggle button is clicked, it commands the autorotation to pause or play', async () => {
      // Click the pause button
      const button = wrapper.find("[data-testid='slideshow__autorotation-button']")
      await button.trigger('click')

      // Assert the custom event has been emitted
      expect(wrapper.emitted('stop-autoplay')).toHaveLength(1)
    })
  })
})
