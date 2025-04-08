import { mount } from '@vue/test-utils'
import ErrorComponent from '@/components/ErrorComponent.vue'

/**********/
/* 1.Test */
/**********/

describe('ErrorComponent.vue', async () => {
  let wrapper

  beforeEach(() => {
    // Component mounting
    wrapper = mount(ErrorComponent)
  })

  // Smoke test
  test('mounts successfully', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  test('renders the error message', () => {
    expect(wrapper.html()).toContain('Loading error, please reload the page.')
  })

  test('the component has NOT been improperly modified', () => {
    expect(wrapper.html()).toMatchInlineSnapshot(
      `"<p class="error-message" role="alert" aria-live="assertive" data-testid="error-message"> Loading error, please reload the page. </p>"`,
    )
  })
})
