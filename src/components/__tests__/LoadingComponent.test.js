import { mount } from '@vue/test-utils'
import LoadingComponent from '@/components/LoadingComponent.vue'

/**********/
/* 1.Test */
/**********/

describe('LoadingComponent.vue', async () => {
  let wrapper

  beforeEach(() => {
    // Component mounting
    wrapper = mount(LoadingComponent)
  })

  // Smoke test
  test('mounts successfully', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  test('renders the loader with its necessary information', () => {
    // Assert the animation in rendered
    const loader = wrapper.find("[data-testid='loader__animation']")
    expect(loader.exists()).toBeTruthy()

    // Assert the animation in not rendered for assistive technologies
    expect(loader.attributes('aria-hidden')).toBe('true')

    // Assert the alternative text is rendered for assistive technologies and search engines
    const alternativeText = wrapper.find("[data-testid='loader__alternative-text']")
    expect(alternativeText.exists()).toBeTruthy()
  })

  test('the component has NOT been improperly modified', () => {
    expect(wrapper.html()).toMatchInlineSnapshot(
      `"<div class="loader" role="status" aria-live="polite"><span class="loader__animation" aria-hidden="true" data-testid="loader__animation"></span><span class="loader__alternative-text sr-only" data-testid="loader__alternative-text">Loading, please wait...</span></div>"`,
    )
  })
})
