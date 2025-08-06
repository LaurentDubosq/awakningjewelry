import { mount } from '@vue/test-utils'
import PaymentSolutions from '@/components/PaymentSolutions.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import frontDataBase from '../../../db.json'
import { getPaymentSolutions } from '@/data/dataFetchers'

/**************/
/* 1.Hoisting */
/**************/

// Mock the "getPaymentSolutions" fetcher
vi.mock('@/data/dataFetchers', () => {
  return {
    getPaymentSolutions: vi.fn(),
  }
})

/********************/
/* 2.Initialization */
/********************/

/* Data */

const mockPaymentSolutionsPending = {
  data: undefined,
  state: 'pending',
}
const mockPaymentSolutionsRejected = {
  data: undefined,
  state: 'rejected',
}
const mockPaymentSolutionsFulfilled = {
  data: frontDataBase.paymentSolutions,
  state: 'fulfilled',
}
const mockPaymentSolutions = mockPaymentSolutionsFulfilled.data
const mockPaymentSolutionsLength = mockPaymentSolutions.length

/***********/
/* 3.Build */
/***********/

// Component mounting (Data fetching "Pending" state)
const mountPaymentSolutions = () => {
  return mount(PaymentSolutions)
}

/**********/
/* 4.Test */
/**********/

// WARNING : The component has 3 states regarding the data fetching state. "Pending", "Rejected" and "Fulfilled". The state by default is "Pending".

describe('PaymentSolutions.vue', () => {
  let wrapper

  beforeEach(() => {
    // Set the getPaymentSolutions fetcher mock state to pending
    getPaymentSolutions.mockReturnValue(mockPaymentSolutionsPending)

    // Component mounting
    wrapper = mountPaymentSolutions()
  })

  // Smoke Tests
  test('mounts successfully', async () => {
    // Assert the wrapper component is well mounted
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('Initial render - Data fetching "Pending" state', () => {
    test('the loader is rendered', async () => {
      // Assert the loading component is rendered
      const loadingComponent = wrapper.findComponent(LoadingComponent)
      expect(loadingComponent.exists()).toBeTruthy()
    })
  })

  describe('Data fetching "Rejected" state', () => {
    test('the error message is rendered', () => {
      // Set the getPaymentSolutions fetcher mock state to rejected
      getPaymentSolutions.mockReturnValue(mockPaymentSolutionsRejected)

      // Remount the component with the rejected state
      wrapper = mountPaymentSolutions()

      // Assert the error message is rendered
      const errorComponent = wrapper.findComponent(ErrorComponent)
      expect(errorComponent.exists()).toBeTruthy()
    })
  })

  describe('Data fetching "Fulfilled" state', async () => {
    beforeEach(() => {
      // Set the getPaymentSolutions fetcher mock state to fulfilled
      getPaymentSolutions.mockReturnValue(mockPaymentSolutionsFulfilled)

      // Remount the component with the fulfilled state
      wrapper = mountPaymentSolutions()
    })

    test('renders the payment solutions', () => {
      // Assert the payment solutions aria-label is rendered
      const list = wrapper.find("[data-testid='payment-solutions']")
      expect(list.attributes('aria-label')).toBe('Payment solutions')

      // Assert all the badges are rendered
      const badges = wrapper.findAll("[data-testid='payment-solution']")
      expect(badges).toHaveLength(mockPaymentSolutionsLength)

      // Assert each badge is rendered with necessary informations
      for (let index = 0; index < badges.length; index++) {
        const badge = badges[index]
        const mockBadge = mockPaymentSolutions[index]
        const mockBadgeURL = mockBadge.url
        const mockBadgeAlt = mockBadge.alt
        const mockBadgeTitle = mockBadge.title

        // Assert the badge has the correct url
        expect(badge.attributes('src')).toBe(mockBadgeURL)

        // Assert the badge has the correct alt
        expect(badge.attributes('alt')).toBe(mockBadgeAlt)

        // Assert the badge has the correct title
        expect(badge.attributes('title')).toBe(mockBadgeTitle)
      }
    })
  })
})
