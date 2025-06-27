import { mount } from '@vue/test-utils'
import SlideshowSlickSlider from '@/components/SlideshowSlickSlider.vue'

/********************/
/* 1.Initialization */
/********************/

const mockSlidesLength = 2 // more than 2 button is not necessary
const mockActiveIndex = 0

/***********/
/* 2.Build */
/***********/

// Component Factory
const mountSlideshowSlickSlider = (props) => {
  return mount(SlideshowSlickSlider, {
    props: {
      slidesLength: mockSlidesLength,
      activeIndex: mockActiveIndex,
      ...props,
    },
  })
}

/**********/
/* 3.Test */
/**********/

describe('SlideshowSlickSlider.vue', () => {
  let wrapper

  beforeEach(() => {
    // Mount the component
    wrapper = mountSlideshowSlickSlider()
  })

  // Smoke Test
  test('mounts successfully', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  test('renders the feature accessibility label', () => {
    const div = wrapper.find("[data-testid='slideshow__slick-slider']")
    expect(div.attributes('aria-label')).toContain('Slideshow navigation')
  })

  test('render all the buttons with their necessary information', () => {
    const buttons = wrapper.findAll("[data-testid='slideshow__slick-slider-button']")

    // Assert all the expected buttons are rendered
    expect(buttons).toHaveLength(mockSlidesLength)

    // Assert each button is rendered with its necessary information
    buttons.forEach((button, index) => {
      // Assert the button is rendered
      expect(button.exists()).toBeTruthy()

      // Assert the "aria-label" has the correct value
      expect(button.attributes('aria-label')).toBe(`Slide ${index + 1}`)

      // Assert the "title" has the correct value
      expect(button.attributes('title')).toBe(`Display slide ${index + 1}`)

      // Assert the active CSS class is used when necessary
      expect(button.classes('slideshow__slick-slider-button--active')).toBe(
        index === mockActiveIndex,
      )
    })
  })

  describe('Behaviors:', () => {
    test('when each button is clicked, it commands its corresponding slide to be displayed', async () => {
      // Find the buttons
      const buttons = wrapper.findAll("[data-testid='slideshow__slick-slider-button']")

      // Assert the order to display the corresponding slide has been emitted
      for (let index = 0; index < buttons.length; index++) {
        const mockPayload = { index: index, focusable: false }

        // Click the button
        await buttons[index].trigger('click')

        // Assert the "displaySlide" custom event has been emitted
        expect(wrapper.emitted('displaySlide')).toHaveLength(index + 1)

        // Assert its payload has the correct value
        expect(wrapper.emitted('displaySlide')[index][0]).toStrictEqual(mockPayload)
      }
    })

    test('when the left arrow key is pressed on each button, it commands the previous slide to be displayed', async () => {
      // Find the buttons
      const buttons = wrapper.findAll("[data-testid='slideshow__slick-slider-button']")

      // Assert the order to display the corresponding slide has been emitted
      for (let index = 0; index < buttons.length; index++) {
        const mockPayload = {
          index: index === 0 ? mockSlidesLength - 1 : index - 1,
          focusable: true,
        }

        // Press the left arrow key
        await buttons[index].trigger('keydown', {
          key: 'ArrowLeft',
          code: 'ArrowLeft',
        })

        // Assert the "displaySlide" custom event has been emitted
        expect(wrapper.emitted('displaySlide')).toHaveLength(index + 1)

        // Assert its payload has the correct value
        expect(wrapper.emitted('displaySlide')[index][0]).toStrictEqual(mockPayload)

        // Update the activeIndex prop for the next iteration
        await wrapper.setProps({ activeIndex: index === 0 ? mockSlidesLength - 1 : index - 1 })
      }
    })

    test('when the right arrow key is pressed on each button, it commands the next slide to be displayed', async () => {
      // Find the buttons
      const buttons = wrapper.findAll("[data-testid='slideshow__slick-slider-button']")

      // Assert the order to display the corresponding slide has been emitted
      for (let index = 0; index < buttons.length; index++) {
        const mockPayload = {
          index: index === mockSlidesLength - 1 ? 0 : index + 1,
          focusable: true,
        }

        // Press the right arrow key
        await buttons[index].trigger('keydown', {
          key: 'ArrowRight',
          code: 'ArrowRight',
        })

        // Assert the "displaySlide" custom event has been emitted
        expect(wrapper.emitted('displaySlide')).toHaveLength(index + 1)

        // Assert its payload has the correct value
        expect(wrapper.emitted('displaySlide')[index][0]).toStrictEqual(mockPayload)

        // Update the activeIndex prop for the next iteration
        await wrapper.setProps({ activeIndex: index === mockSlidesLength - 1 ? 0 : index + 1 })
      }
    })

    test('when the home key is pressed on each button, it commands the first slide to be displayed', async () => {
      // Find the buttons
      const buttons = wrapper.findAll("[data-testid='slideshow__slick-slider-button']")

      // Assert the order to display the corresponding slide has been emitted
      for (let index = 0; index < buttons.length; index++) {
        const mockPayload = {
          index: 0,
          focusable: true,
        }

        // Press the "home" key
        await buttons[index].trigger('keydown', {
          key: 'Home',
          code: 'Home',
        })

        // Assert the "displaySlide" custom event has been emitted
        expect(wrapper.emitted('displaySlide')).toHaveLength(index + 1)

        // Assert its payload has the correct value
        expect(wrapper.emitted('displaySlide')[index][0]).toStrictEqual(mockPayload)
      }
    })

    test("when the 'end' key is pressed on each button, it commands the last slide to be displayed", async () => {
      // Find the buttons
      const buttons = wrapper.findAll("[data-testid='slideshow__slick-slider-button']")

      // Assert the order to display the corresponding slide has been emitted
      for (let index = 0; index < buttons.length; index++) {
        const mockPayload = {
          index: mockSlidesLength - 1,
          focusable: true,
        }

        // Press the "end" key
        await buttons[index].trigger('keydown', {
          key: 'End',
          code: 'End',
        })

        // Assert the "displaySlide" custom event has been emitted
        expect(wrapper.emitted('displaySlide')).toHaveLength(index + 1)

        // Assert its payload has the correct value
        expect(wrapper.emitted('displaySlide')[index][0]).toStrictEqual(mockPayload)
      }
    })

    test('when any button is focused, the slick slider receives the CSS focus indicator', async () => {
      // Find the buttons
      const buttons = wrapper.findAll("[data-testid='slideshow__slick-slider-button']")

      // Assert any button focused focuses the slick slider
      for (let index = 0; index < buttons.length; index++) {
        // Assert the slick slider don't have a focus indicator
        expect(wrapper.classes('focus-visible')).toBeFalsy()

        // Focus the button
        await buttons[index].trigger('focus')

        // Assert the slick slider has received the focus indicator
        expect(wrapper.classes('focus-visible')).toBeTruthy()

        // Blur on the button
        await buttons[index].trigger('blur')

        // Assert the slick slider don't have a focus indicator for the next iteration
        expect(wrapper.classes('focus-visible')).toBeFalsy()
      }
    })
  })
})
