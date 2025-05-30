import { computed, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import NewsletterSignup from '@/components/NewsletterSignup.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import frontDataBase from '../../../db.json'
import { createRouter, createWebHistory } from 'vue-router'
import { defineComponent } from 'vue'
import { defineStore } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import { subscribeToNewsletter } from '@/services/newsletterSignup'

/**************/
/* 1.Hoisting */
/**************/

// Mock the "subscribeToNewsletter" module function
vi.mock('@/services/newsletterSignup', () => {
  return {
    subscribeToNewsletter: vi.fn(''),
  }
})

/********************/
/* 2.Initialization */
/********************/

/* Router */

const mockRouter = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      component: defineComponent({
        template: '<div>Mocked Component</div>',
      }),
    },
  ],
})

/* Data */

const mockWordingPendingResult = {
  wording: undefined,
  wordingfetchStatus: 'pending',
}
const mockWordingRejectedResult = {
  wording: undefined,
  wordingfetchStatus: 'rejected',
}
const mockWordingResolvedResult = {
  wording: frontDataBase.newsletterSignupWording,
  wordingfetchStatus: 'resolved',
}
const mockWording = frontDataBase.newsletterSignupWording
const mockWordingTitle = mockWording.title
const mockWordingDescription = mockWording.description
const mockWordingInputPlaceholder = mockWording.inputPlaceholder
const mockWordingInputTitle = mockWording.inputTitle
const mockWordingLabel = mockWording.label
const mockWordingButtonText = mockWording.buttonText
const mockWordingConsentNote = mockWording.consentNote
const mockWordingConsentNoteLinkText = mockWording.consentNoteLinkText
const mockWordingUnsubscriptionNote = mockWording.unsubscriptionNote
const mockWordingUnsubscriptionNoteLinkText = mockWording.unsubscriptionNoteLinkText

/* Stores */

// Initialize a testing pinia instance
const mockPinia = createTestingPinia()

// Create the store(s)
const mockUseWordingResultStore = defineStore('NewsletterSignupWordingResult', () => {
  const wordingFetchResult = ref(mockWordingPendingResult)
  const wording = computed(() => wordingFetchResult.value?.wording)
  const wordingFetchStatus = computed(() => wordingFetchResult.value?.wordingfetchStatus)
  return { wordingFetchResult, wording, wordingFetchStatus }
})

// Initialize the store(s)
const mockWordingResultStore = mockUseWordingResultStore()

/***********/
/* 3.Build */
/***********/

// Component factory (Data fetching "Pending" state)
function mountNewsletterSignup() {
  return mount(NewsletterSignup, {
    attachTo: document.body,
    global: {
      plugins: [mockRouter, mockPinia],
    },
  })
}

/**********/
/* 4.Test */
/**********/

// WARNING : The component has 3 states regarding the wording fetching status. "Pending", "Rejected" and "Resolved". The state by default is "Pending".

describe('NewsletterSignup', () => {
  let wrapper

  beforeEach(() => {
    // Mount the component (Data fetching "Pending" state)
    wrapper = mountNewsletterSignup()
  })

  afterEach(() => {
    // Reset the store(s) and module(s) state(s) to default to ensure a clean environment for each test
    mockWordingResultStore.wordingFetchResult = mockWordingPendingResult

    // Reset function call count
    vi.clearAllMocks()
  })

  // Smoke test
  test('mounts successfully', () => {
    // Assert the wrapper component is well mounted at initial render
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('Initial render - Data fetching "Pending" state', () => {
    test('the loader animation is rendered', async () => {
      const loadingComponent = wrapper.findComponent(LoadingComponent)
      expect(loadingComponent.exists()).toBeTruthy()
    })
  })

  describe('Data fetching "Rejected" state', () => {
    test('the error message is rendered', async () => {
      // Set the store wording fetching status to rejected
      mockWordingResultStore.wordingFetchResult = mockWordingRejectedResult
      await nextTick()

      // Assert the error message is rendered
      const errorComponent = wrapper.findComponent(ErrorComponent)
      expect(errorComponent.exists()).toBeTruthy()
    })
  })

  describe('Data fetching "Resolved" state', async () => {
    beforeEach(async () => {
      // Set the store wording fetching status to resolved
      mockWordingResultStore.wordingFetchResult = mockWordingResolvedResult
      await nextTick()
    })

    test('renders the title', () => {
      const title = wrapper.find("[data-testid='newsletter-signup__title']")
      expect(title.html()).toContain(mockWordingTitle)
    })

    test('renders the description', () => {
      const description = wrapper.find("[data-testid='newsletter-signup__description']")
      expect(description.html()).toContain(mockWordingDescription)
    })

    test('renders the email field', () => {
      // Assert its label is rendered
      const label = wrapper.find("[data-testid='newsletter-signup__form-label']")
      expect(label.exists()).toBeTruthy()
      expect(label.text()).toBe(mockWordingLabel)

      // Assert its input is rendered
      const input = wrapper.find("[data-testid='newsletter-signup__form-input']")
      expect(input.exists()).toBeTruthy()
      expect(input.attributes('placeholder')).toBe(mockWordingInputPlaceholder)
      expect(input.attributes('title')).toBe(mockWordingInputTitle)
    })

    test('renders the button', () => {
      const button = wrapper.find("[data-testid='newsletter-signup__form-button']")
      expect(button.exists()).toBeTruthy()
      expect(button.html()).toContain(mockWordingButtonText)
    })

    test('renders the mention', () => {
      // Get the mention
      const mention = wrapper.find("[data-testid='newsletter-signup__mention']")
      const mentionHTML = mention.html()
      const consentNoteLink = wrapper.find("[data-testid='mention__consent-note-link']")
      const unsubscriptionNoteLink = wrapper.find(
        "[data-testid='mention__unsubscription-note-link']",
      )

      // Assert the consent note is rendered with the privacy policy page link
      expect(mentionHTML).toContain(mockWordingConsentNote)
      expect(mentionHTML).toContain(mockWordingConsentNoteLinkText)
      expect(consentNoteLink.attributes('href')).toBe('/privacy-policy')

      // Assert the unsubscription note is rendered with the contact page link
      expect(mentionHTML).toContain(mockWordingUnsubscriptionNote)
      expect(mentionHTML).toContain(mockWordingUnsubscriptionNoteLinkText)
      expect(unsubscriptionNoteLink.attributes('href')).toBe('/contact-us')
    })

    describe('Behaviors:', () => {
      test('when the email address is entered and the button is clicked, it triggers the back-end to register the newsletter subscription', async () => {
        // Set the email address to the email field
        const input = wrapper.find("[data-testid='newsletter-signup__form-input']")
        await input.setValue('test@mail.com')

        // Assert the email address is rendered
        expect(input.element.value).toBe('test@mail.com')

        // Click/touch the button
        const button = wrapper.find("[data-testid='newsletter-signup__form-button']")
        await button.trigger('click')

        // Assert the registration of the email to the newsletter list has ordered
        expect(subscribeToNewsletter).toHaveBeenCalledTimes(1)

        // Assert the function was called with 'test@mail.com'
        expect(subscribeToNewsletter).toHaveBeenCalledWith('test@mail.com')
      })

      test('when the subscription encounters an error, render an error message', async () => {
        const mockMessage = 'Your email is not valid !'

        // Set the subscribeNewsletter mock status to error
        subscribeToNewsletter.mockResolvedValue({
          success: false,
          error: true,
          message: mockMessage,
        })

        // Set the email address to the email field
        const input = wrapper.find("[data-testid='newsletter-signup__form-input']")
        await input.setValue('test@mail.com')

        // Click/touch the button
        const button = wrapper.find("[data-testid='newsletter-signup__form-button']")
        await button.trigger('click')

        // Assert the error message has been rendered
        const message = wrapper.find("[data-testid='newsletter-signup__form-message']")
        expect(message.exists()).toBeTruthy()
        expect(message.text()).toBe(mockMessage)
      })

      test('when the subscription is a success, render a success message in place of the form', async () => {
        const mockMessage = 'Your email has been registered !'

        // Set the subscribeNewsletter mock status to success
        subscribeToNewsletter.mockResolvedValue({
          success: true,
          error: false,
          message: mockMessage,
        })

        // Set the email address to the email field
        const input = wrapper.find("[data-testid='newsletter-signup__form-input']")
        await input.setValue('test@mail.com')

        // Click/touch the button
        const button = wrapper.find("[data-testid='newsletter-signup__form-button']")
        await button.trigger('click')

        // Assert the success message has been rendered
        const message = wrapper.find("[data-testid='newsletter-signup__form-message']")
        expect(message.exists()).toBeTruthy()
        expect(message.text()).toBe(mockMessage)

        // Assert the form container is no longer rendered
        const container = wrapper.find("[data-testid='newsletter-signup__form-inner-container']")
        expect(container.exists()).toBeFalsy()
      })
    })
  })
})
