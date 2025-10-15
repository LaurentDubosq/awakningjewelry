import { mount } from '@vue/test-utils'
import BackToTop from '@/components/BackToTop.vue'
import { nextTick } from 'vue'

/*********************/
/* 1.Initializations */
/*********************/

// Mock the "window.scrollTo" method
window.scrollTo = vi.fn().mockImplementation(() => {
  window.scrollY = 0
})

/***********/
/* 2.Build */
/***********/

// Component factory
const mountBackToTop = () => {
  return mount(BackToTop, { attachTo: document.body })
}

/**********/
/* 3.Test */
/**********/

// WARNING : The component has 2 states regarding the back to top button display. The state by default hide the button.

describe('BackToTop.vue', () => {
  let wrapper

  beforeEach(() => {
    // Component mounting
    wrapper = mountBackToTop()
  })

  // Smoke test
  test('mounts successfully', () => {
    // Assert the wrapper component is well mounted at initial render
    expect(wrapper.exists()).toBeTruthy()
  })

  // Renders
  describe('Renders:', () => {
    describe('Initial render - Back to top button hidden', () => {
      test('button is hidden', async () => {
        // Assert the button exists
        const button = wrapper.find("[data-testid='back-to-top']")
        expect(button.exists()).toBeTruthy()

        // Assert the button is hidden
        expect(button.isVisible()).toBeFalsy()
      })
    })
  })

  // Behaviors
  describe('Behaviors:', () => {
    beforeEach(async () => {
      // Simulate the page has been scrolled vertically to 3 screens more
      window.scrollY = 2305 // 768 * 3 screens + 1 pixel (768 corresponds to the JSDOM window.innerHeight value)
      window.dispatchEvent(new Event('scroll'))
      await nextTick()
    })

    test('When the user scrolls vertically beyond 3 screens, the button is rendered with its information', async () => {
      // Assert the button is rendered
      const button = wrapper.find("[data-testid='back-to-top']")
      expect(button.isVisible()).toBeTruthy()

      // Assert the icon is rendered
      const icon = wrapper.find("[data-testid='back-to-top__icon']")
      expect(icon.isVisible()).toBeTruthy()

      // Assert the alternative text is rendered
      expect(button.attributes('aria-label')).toContain('Back to top')
    })

    test('When the mouse enter the button, its color contrast is improved', async () => {
      // Assert the button is visible
      const button = wrapper.find("[data-testid='back-to-top']")
      expect(button.isVisible()).toBeTruthy()

      // Mouseenter the button
      await button.trigger('mouseenter')

      // Assert the button color contrast is improved
      expect(button.classes()).toContain('back-to-top--hover')
    })

    test('When the button is clicked, the back to top has been done successfully and the button is hidden', async () => {
      // Assert the button is visible
      const button = wrapper.find("[data-testid='back-to-top']")
      expect(button.isVisible()).toBeTruthy()

      // Click the button
      await button.trigger('click')
      window.dispatchEvent(new Event('scroll')) // simulate scroll event to update button display
      await nextTick()

      // Assert the back to top has been done successfully
      expect(window.scrollY).toStrictEqual(0)

      // Assert the button is hidden
      expect(button.isVisible()).toBeFalsy()
    })
  })
})
