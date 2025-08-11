import { mount } from '@vue/test-utils'
import NewsletterSignupForm from '@/components/NewsletterSignupForm.vue'
import frontDataBase from '../../../db.json'
import { createRouter, createWebHistory } from 'vue-router'
import { defineComponent } from 'vue'
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

const mockForm = frontDataBase.newsletterSignupWording.form
const mockInputPlaceholder = mockForm.inputPlaceholder
const mockInputTitle = mockForm.inputTitle
const mockLabel = mockForm.label
const mockButtonText = mockForm.buttonText

/***********/
/* 3.Build */
/***********/

// Component factory
const mountNewsletterSignup = () => {
  return mount(NewsletterSignupForm, {
    attachTo: document.body,
    props: { form: mockForm },
    global: {
      plugins: [mockRouter],
    },
  })
}

/**********/
/* 4.Test */
/**********/

describe('NewsletterSignup', () => {
  let wrapper

  beforeEach(() => {
    // Mount the component
    wrapper = mountNewsletterSignup()
  })

  afterEach(() => {
    // Reset function call count
    vi.clearAllMocks()
  })

  // Smoke test
  test('mounts successfully', () => {
    // Assert the wrapper component is well mounted at initial render
    expect(wrapper.exists()).toBeTruthy()
  })

  test('renders the email field', () => {
    // Assert its label is rendered
    const label = wrapper.find("[data-testid='newsletter-signup__form-label']")
    expect(label.exists()).toBeTruthy()
    expect(label.text()).toBe(mockLabel)

    // Assert its input is rendered
    const input = wrapper.find("[data-testid='newsletter-signup__form-input']")
    expect(input.exists()).toBeTruthy()
    expect(input.attributes('placeholder')).toBe(mockInputPlaceholder)
    expect(input.attributes('title')).toBe(mockInputTitle)
  })

  test('renders the button', () => {
    const button = wrapper.find("[data-testid='newsletter-signup__form-button']")
    expect(button.exists()).toBeTruthy()
    expect(button.html()).toContain(mockButtonText)
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
        status: 'error',
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
        status: 'success',
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
