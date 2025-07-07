import { mount, RouterLinkStub } from '@vue/test-utils'
import NotFound from '../NotFound.vue'

/***********/
/* 1.Build */
/***********/

// Component Factory
const mountNotFound = () => {
  return mount(NotFound, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub,
      },
    },
  })
}

/**********/
/* 2.Test */
/**********/

describe('NotFound.vue', () => {
  let wrapper

  beforeEach(() => {
    // Mount the component
    wrapper = mountNotFound()
  })

  // Smoke test
  test('mounts successfully', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  test('renders the title page', () => {
    const title = wrapper.find('h1')
    expect(title.text()).toBe('Not Found')
  })

  test('renders the message', () => {
    expect(wrapper.text()).toContain("Oops, we couldn't find that page. Try going home.")
  })

  test('renders the redirection link with necessary information', () => {
    // Find the link
    const link = wrapper.findComponent(RouterLinkStub)

    // Assert the text is rendered
    expect(link.text()).toContain('home')

    // Assert the link has the correct url
    expect(link.props('to')).toBe('/')
  })
})
