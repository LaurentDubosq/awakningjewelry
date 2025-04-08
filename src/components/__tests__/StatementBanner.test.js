import { mount } from '@vue/test-utils'
import StatementBanner from '@/components/StatementBanner.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import frontDataBase from '../../../db.json'

/********************/
/* 1.Initialization */
/********************/

const mockStatementPending = {
  statement: undefined,
  fetchStatus: 'pending',
}
const mockStatementRejected = {
  statement: undefined,
  fetchStatus: 'rejected',
}
const mockStatementResolved = {
  statement: frontDataBase.statementMission,
  fetchStatus: 'resolved',
}
const mockStatement = mockStatementResolved.statement
const mockStatementTitle = mockStatement.title
const mockStatementText = mockStatement.text
const mockStatementImageURL = mockStatement.image.url
const mockStatementImageAlt = mockStatement.image.alt

/***********/
/* 2.Build */
/***********/

// Component Factory (Data fetching "Pending" state)
function mountStatementBanner(props) {
  return mount(StatementBanner, {
    props: {
      statement: mockStatementPending.statement,
      fetchStatus: mockStatementPending.fetchStatus,
      ...props,
    },
  })
}

/**********/
/* 3.Test */
/**********/

// WARNING : The component has 3 states regarding the data fetching status. "Pending", "Rejected" and "Resolved". The state by default is "Pending".

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
      const wrapper = mountStatementBanner(mockStatementRejected)

      // Assert the error message is rendered
      const errorComponent = wrapper.findComponent(ErrorComponent)
      expect(errorComponent.exists()).toBeTruthy()
    })
  })

  describe('Data fetching "Resolved" state', () => {
    test('renders the statement with necessary information', () => {
      // Mount the component (resolved state)
      const wrapper = mountStatementBanner(mockStatementResolved)

      // Assert its title is rendered
      const title = wrapper.find("[data-testid='statement-banner__title']")
      expect(title.text()).toContain(mockStatementTitle)

      // Assert its text is rendered
      const text = wrapper.find("[data-testid='statement-banner__text']")
      expect(text.text()).toContain(mockStatementText)

      // Find the image
      const image = wrapper.find("[data-testid='statement-banner__image']")

      // Assert the image is rendered
      expect(image.exists()).toBeTruthy()

      // Assert the image "src" attribute is well setted
      expect(image.attributes('src')).toBe(mockStatementImageURL)

      // Assert the image "alt" attribute is well setted
      expect(image.attributes('alt')).toBe(mockStatementImageAlt)
    })
  })
})
