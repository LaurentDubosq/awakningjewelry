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

// WARNING : The component has 2 states regarding the slideshow playing state. True or false. The state by default is true.

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

      // Assert the "pause" icon doesn't exist for screen readers
      expect(icon.attributes('aria-hidden')).toBe('true')

      // Assert the title is rendered with the correct value
      expect(button.attributes('title')).toBe('Stop the slide show')

      // Assert the "aria-label" is rendered with the correct value
      expect(button.attributes('aria-label')).toBe('Stop automatic slide show')
    })
  })

  describe('Playing state is false', () => {
    test('renders the autoration toggle button with necessary information', () => {
      // Component mounting (Playing state is false)
      wrapper = mountSlideshowAutorotationButton({ isPlaying: false })

      // Find elements
      const button = wrapper.find("[data-testid='slideshow__autorotation-button']")
      const icon = wrapper.find("[data-testid='icon-play']")

      // Assert the "play" icon is rendered
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
      expect(wrapper.emitted('toggleAutoplayExplicitly')).toHaveLength(1)
    })

    test('when the autoration toggle button is touched, it commands the autorotation to pause or play', async () => {
      // Touch the pause button
      const button = wrapper.find("[data-testid='slideshow__autorotation-button']")
      await button.trigger('touchstart')
      await button.trigger('touchend')

      // Assert the custom event has been emitted
      expect(wrapper.emitted('toggleAutoplayExplicitly')).toHaveLength(1)
    })

    test('when the autoration toggle button is focused, it allows screen readers to read slides', async () => {
      // Focused the pause button
      const button = wrapper.find("[data-testid='slideshow__autorotation-button']")
      await button.trigger('focus')

      // Assert the custom event has been emitted
      expect(wrapper.emitted('handleFocus')).toHaveLength(1)
    })

    test('when the autoration toggle button is focusout, it disallows screen readers to read slides', async () => {
      // Focused the pause button
      const button = wrapper.find("[data-testid='slideshow__autorotation-button']")
      await button.trigger('blur')

      // Assert the custom event has been emitted
      expect(wrapper.emitted('handleBlur')).toHaveLength(1)
    })
  })
})
