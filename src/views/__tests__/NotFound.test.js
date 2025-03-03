import { mount, RouterLinkStub } from '@vue/test-utils'
import NotFound from '../NotFound.vue'

/***********/
/* 1.Build */
/***********/

// Component Factory
function mountNotFound() {
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
    wrapper = mountNotFound()
  })

  // Smoke test
  test('mounts successfully', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  test('the component has not been improperly modified', () => {
    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div class="not-found-container wrapper">
        <h1>Not Found</h1>
        <p> Oops, we couldn't find that page. Try going <a>home</a></p>
      </div>"
    `)
  })

  test('its redirection link has the correct url', () => {
    const link = wrapper.findComponent(RouterLinkStub)
    expect(link.props('to')).toBe('/')
  })
})
