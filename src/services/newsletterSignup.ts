import type { NewsletterSignupResult } from '@/types/services'
const SITE_DATA_API_BASE_URL = import.meta.env.VITE_SITE_DATA_API_URL

// Logic to add email to newsletter list
export const subscribeToNewsletter = async (email: string): Promise<NewsletterSignupResult> => {
  try {
    const response = await fetch(`${SITE_DATA_API_BASE_URL}/newsletterSubscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, subscribedAt: new Date().toISOString() }),
    })

    // The following "data" variable is commented until an external server will operate in production
    // const data: NewsletterSignupResult = await response.json()

    if (response.ok) {
      // The returned object as follows exists for developement purpose. Please replace it with the "data" variable for production.
      return {
        status: 'success',
        message: 'You are registered to the newsletter !',
      }
    } else {
      // The message variable exists for developement purpose. Please replace it with "data.message" for production.
      const message = 'Unable to register your email. Please avoid using special characters !'
      throw new Error(message)
    }
  } catch (error: unknown) {
    let message: string

    if (error instanceof TypeError) {
      message = 'Network error: Please check your internet connection.'
    } else if (error instanceof Error) {
      message = error.message
    } else {
      message = 'An unknown error occurred'
    }

    return {
      status: 'error',
      message,
    }
  }
}
