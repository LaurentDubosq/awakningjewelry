import { mount } from '@vue/test-utils'
import StatementBanner from '@/components/StatementBanner.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import frontDataBase from '../../../db.json'

/********************/
/* 1.Initialization */
/********************/

const mockContentPendingResult = {
  content: undefined,
  contentFetchState: 'pending',
}
const mockContentRejectedResult = {
  content: undefined,
  contentFetchState: 'rejected',
}
const mockContentFulfilledResult = {
  content: frontDataBase.missionStatementBannerContent,
  contentFetchState: 'fulfilled',
}
const mockContent = mockContentFulfilledResult.content
const mockContentTitle = mockContent.title
const mockContentStatement = mockContent.statement
const mockContentImageURL = mockContent.image.url
const mockContentImageAlt = mockContent.image.alt

/***********/
/* 2.Build */
/***********/

// Component Factory (Data fetching "Pending" state)
const mountStatementBanner = (props) => {
  return mount(StatementBanner, {
    props: {
      content: mockContentPendingResult.content,
      contentFetchState: mockContentPendingResult.contentFetchState,
      ...props,
    },
  })
}

/**********/
/* 3.Test */
/**********/

// WARNING : The component has 3 states regarding the data fetching state. "Pending", "Rejected" and "Fulfilled". The state by default is "Pending".

describe('StatementBanner.vue', () => {
  let wrapper

  beforeEach(() => {
    // Component mounting (Data fetching "Pending" state)
    wrapper = mountStatementBanner()
  })

  // Smoke test
  test('mounts successfully', () => {
    // Assert the wrapper component is well mounted at initial render
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('Initial render - Data fetching "Pending" state', () => {
    test('the loader is rendered', async () => {
      const loadingComponent = wrapper.findComponent(LoadingComponent)
      expect(loadingComponent.exists()).toBeTruthy()
    })
  })

  describe('Data fetching "Rejected" state', () => {
    test('the error message is rendered', () => {
      // Mount the component (rejected state)
      const wrapper = mountStatementBanner(mockContentRejectedResult)

      // Assert the error message is rendered
      const errorComponent = wrapper.findComponent(ErrorComponent)
      expect(errorComponent.exists()).toBeTruthy()
    })
  })

  describe('Data fetching "Fulfilled" state', () => {
    test('renders the statement with necessary information', () => {
      // Mount the component (fulfilled state)
      const wrapper = mountStatementBanner(mockContentFulfilledResult)

      // Assert its title is rendered
      const title = wrapper.find("[data-testid='statement-banner__title']")
      expect(title.text()).toContain(mockContentTitle)

      // Assert its text is rendered
      const text = wrapper.find("[data-testid='statement-banner__statement']")
      expect(text.text()).toContain(mockContentStatement)

      // Find the image
      const image = wrapper.find("[data-testid='statement-banner__image']")

      // Assert the image is rendered
      expect(image.exists()).toBeTruthy()

      // Assert the image "src" attribute is well setted
      expect(image.attributes('src')).toBe(mockContentImageURL)

      // Assert the image "alt" attribute is well setted
      expect(image.attributes('alt')).toBe(mockContentImageAlt)
    })
  })
})
