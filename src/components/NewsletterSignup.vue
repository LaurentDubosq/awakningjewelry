<script setup lang="ts">
import LoadingComponent from './LoadingComponent.vue'
import ErrorComponent from './ErrorComponent.vue'
import { useNewsletterSignupWordingStore } from '@/stores/newsletterSignupWording'
import { storeToRefs } from 'pinia'
import { ref, type Ref } from 'vue'
import { subscribeToNewsletter } from '@/services/newsletterSignup'
import type { NewsletterSignupResult } from '@/types/global'

/* Component Data Fetching */
const newsletterSignupWordingStore = useNewsletterSignupWordingStore()
const { wording, wordingFetchState } = storeToRefs(newsletterSignupWordingStore)

/* Component Interactivities */
const email: Ref<string> = ref('')
const signupResult: Ref<undefined | NewsletterSignupResult> = ref()

const handleSubmit = async () => {
  signupResult.value = await subscribeToNewsletter(email.value)
}

// Utilities
const hasSignupSucceeded = () => {
  return signupResult.value?.status === 'success'
}
const hasSignupFailed = () => {
  return signupResult.value?.status === 'error'
}
</script>

<template>
  <section class="newsletter-signup" aria-label="Newsletter signup" data-testid="newsletter-signup">
    <div class="wrapper">
      <template v-if="wordingFetchState === 'fulfilled'">
        <h2 class="newsletter-signup__title" data-testid="newsletter-signup__title">
          {{ wording?.title }}
        </h2>
        <p class="newsletter-signup__description" data-testid="newsletter-signup__description">
          {{ wording?.description }}
        </p>
        <form
          class="newsletter-signup__form"
          @submit.prevent="handleSubmit()"
          data-testid="newsletter-signup__form"
        >
          <div
            class="newsletter-signup__form-inner-container"
            v-if="!hasSignupSucceeded()"
            data-testid="newsletter-signup__form-inner-container"
          >
            <label
              for="newsletter-signup__form-input"
              class="sr-only"
              data-testid="newsletter-signup__form-label"
              >{{ wording?.label }}</label
            >
            <input
              class="newsletter-signup__form-input"
              id="newsletter-signup__form-input"
              type="email"
              v-model="email"
              :placeholder="wording?.inputPlaceholder"
              :title="wording?.inputTitle"
              :aria-invalid="hasSignupFailed()"
              :aria-describedby="
                signupResult?.message ? 'newsletter-signup__form-message' : undefined
              "
              autocorrect="off"
              autocapitalize="off"
              autocomplete="email"
              required
              data-testid="newsletter-signup__form-input"
            />
            <button
              class="newsletter-signup__form-button btn btn--primary"
              type="submit"
              data-testid="newsletter-signup__form-button"
            >
              {{ wording?.buttonText }}
            </button>
          </div>
          <p
            class="newsletter-signup__form-message"
            id="newsletter-signup__form-message"
            v-if="signupResult?.message"
            :class="{
              'newsletter-signup__form-message-success': hasSignupSucceeded(),
              'newsletter-signup__form-message-error': hasSignupFailed(),
            }"
            role="alert"
            data-testid="newsletter-signup__form-message"
          >
            {{ signupResult?.message }}
          </p>
        </form>
        <p class="newsletter-signup__mention" data-testid="newsletter-signup__mention">
          {{ wording?.consentNote }}
          <RouterLink
            class="link-text"
            to="/privacy-policy"
            data-testid="mention__consent-note-link"
            >{{ wording?.consentNoteLinkText }}</RouterLink
          >.<br />
          {{ wording?.unsubscriptionNote }}
          <RouterLink
            class="link-text"
            to="/contact-us"
            data-testid="mention__unsubscription-note-link"
            >{{ wording?.unsubscriptionNoteLinkText }}</RouterLink
          >.
        </p>
      </template>
      <LoadingComponent v-else-if="wordingFetchState === 'pending'" />
      <ErrorComponent v-else-if="wordingFetchState === 'rejected'" />
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants.scss' as *;

.newsletter-signup {
  background-color: $AwakningColorBackgroundMuted;
  padding: 30px 0;

  @media screen and (min-width: $BreakpointDesktop) {
    padding: 60px 0;
  }

  &__title {
    font-size: 1.875rem;
    line-height: 1.4;
    text-align: center;
    margin-bottom: 15px;

    @media screen and (min-width: $BreakpointDesktop) {
      margin-bottom: 12px;
    }
  }

  &__description {
    font-size: 1.25rem;
    text-align: center;
    margin-bottom: 42px;

    @media screen and (min-width: $BreakpointDesktop) {
      margin-bottom: 50px;
    }
  }

  &__form {
    background-color: $AwakningColorBackground;
    padding: 10px;
    max-width: 520px;
    margin: 0 auto 30px;
  }

  &__form-inner-container {
    display: flex;
  }

  &__form-input {
    padding: 8px 10px;
    min-width: 1px;
    flex-grow: 1;
  }

  &__form-message {
    padding: 6px 12px;
    font-size: 0.9rem;
  }

  &__form-message-success {
    background-color: $AwakningColorBackgroundSuccess;
    border: 1px solid $AwakningColorSuccess;
    color: $AwakningColorSuccess;
  }

  &__form-message-error {
    margin-top: 10px;
    background-color: $AwakningColorBackgroundError;
    border: 1px solid $AwakningColorError;
    color: $AwakningColorError;
  }

  &__mention {
    text-align: center;
  }
}
</style>
