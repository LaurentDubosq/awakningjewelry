import { mount, RouterLinkStub } from '@vue/test-utils'
import QuoteBanner from '@/components/QuoteBanner.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import frontDataBase from '../../../db.json'

/********************/
/* 1.Initialization */
/********************/

/* Data */

const mockContentPendingResult = {
  content: undefined,
  contentFetchState: 'pending',
}
const mockContentRejectedResult = {
  content: undefined,
  contentFetchState: 'rejected',
}
const mockContentFulfilledResult = {
  content: frontDataBase.founderQuoteBannerContent,
  contentFetchState: 'fulfilled',
}
const mockContent = frontDataBase.founderQuoteBannerContent
const mockContentQuote = mockContent.quote
const mockContentAuthor = mockContent.author
const mockContentAuthorIMG = mockContent.authorIMG
const mockContentAuthorIMGAlt = mockContent.authorIMGAlt
const mockContentAuthorIMGTitle = mockContent.authorIMGTitle
const mockContentLinkText = mockContent.linkText
const mockContentLinkURL = mockContent.linkURL

/***********/
/* 2.Build */
/***********/

// Component factory (Content fetching "Pending" state)
function mountQuoteBanner(props) {
  return mount(QuoteBanner, {
    props: {
      content: mockContentPendingResult.content,
      contentFetchState: mockContentPendingResult.contentFetchState,
      ...props,
    },
    global: {
      stubs: {
        RouterLink: RouterLinkStub,
      },
    },
  })
}

/**********/
/* 3.Test */
/**********/

// WARNING : The component has 3 states regarding the content fetching status. "Pending", "Rejected" and "Fulfilled". The state by default is "Pending".

describe('QuoteBanner', () => {
  let wrapper

  beforeEach(() => {
    // Mount the component (Content fetching "Pending" state)
    wrapper = mountQuoteBanner()
  })

  // Smoke test
  test('mounts successfully', () => {
    // Assert the wrapper component is well mounted at initial render
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('Initial render - Content fetching "Pending" state', () => {
    test('the loader animation is rendered', async () => {
      const loadingComponent = wrapper.findComponent(LoadingComponent)
      expect(loadingComponent.exists()).toBeTruthy()
    })
  })

  describe('Content fetching "Rejected" state', () => {
    test('the error message is rendered', async () => {
      // Mount the component (rejected state)
      const wrapper = mountQuoteBanner(mockContentRejectedResult)

      // Assert the error message is rendered
      const errorComponent = wrapper.findComponent(ErrorComponent)
      expect(errorComponent.exists()).toBeTruthy()
    })
  })

  describe('Content fetching "Fulfilled" state', async () => {
    beforeEach(async () => {
      // Mount the component (fulfilled state)
      wrapper = mountQuoteBanner(mockContentFulfilledResult)
    })

    test('renders the quote', () => {
      const quote = wrapper.find("[data-testid='quote-banner__quote']")
      expect(quote.html()).toContain(mockContentQuote)
    })

    test("renders the author's name", () => {
      const author = wrapper.find("[data-testid='quote-banner__author']")
      expect(author.text()).toContain(mockContentAuthor)
    })

    test("renders the author's photo", () => {
      const photo = wrapper.find("[data-testid='quote-banner__author-photo']")
      expect(photo.exists()).toBeTruthy()
      expect(photo.attributes('src')).toContain(mockContentAuthorIMG)
      expect(photo.attributes('alt')).toContain(mockContentAuthorIMGAlt)
      expect(photo.attributes('title')).toContain(mockContentAuthorIMGTitle)
    })

    test('renders the link button', () => {
      const link = wrapper.findComponent(RouterLinkStub)
      expect(link.exists()).toBeTruthy()
      expect(link.html()).toContain(mockContentLinkText)
      expect(link.props('to')).toBe(mockContentLinkURL)
    })
  })
})
