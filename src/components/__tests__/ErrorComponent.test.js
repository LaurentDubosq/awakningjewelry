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
      `"<p data-v-00bc1f96="" class="error-message" role="alert" data-testid="error-message"> Loading error, please reload the page. </p>"`,
    )
  })
})
