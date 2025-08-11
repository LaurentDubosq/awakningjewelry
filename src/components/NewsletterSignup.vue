<script setup lang="ts">
import LoadingComponent from './LoadingComponent.vue'
import ErrorComponent from './ErrorComponent.vue'
import { useNewsletterSignupWordingStore } from '@/stores/newsletterSignupWording'
import { storeToRefs } from 'pinia'
import NewsletterSignupForm from './NewsletterSignupForm.vue'

const newsletterSignupWordingStore = useNewsletterSignupWordingStore()
const { wording, wordingFetchState } = storeToRefs(newsletterSignupWordingStore)
</script>

<template>
  <section class="newsletter-signup" aria-label="Newsletter signup" data-testid="newsletter-signup">
    <template v-if="wordingFetchState === 'fulfilled'">
      <div class="wrapper">
        <h2 class="newsletter-signup__title" data-testid="newsletter-signup__title">
          {{ wording?.title }}
        </h2>
        <p class="newsletter-signup__description" data-testid="newsletter-signup__description">
          {{ wording?.description }}
        </p>
        <NewsletterSignupForm :form="wording?.form" v-if="wording?.form" />
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
      </div>
    </template>
    <LoadingComponent v-else-if="wordingFetchState === 'pending'" />
    <ErrorComponent v-else-if="wordingFetchState === 'rejected'" />
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants.scss' as *;

.newsletter-signup {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $AwakningColorBackgroundMuted;
  padding: 30px 0;
  min-height: 299px;
  @media screen and (min-width: $breakpointDesktop) {
    padding: 60px 0;
    min-height: 279px;
  }

  &__title {
    font-size: 1.875rem;
    line-height: 1.4;
    text-align: center;
    margin-bottom: 15px;

    @media screen and (min-width: $breakpointDesktop) {
      margin-bottom: 12px;
    }
  }

  &__description {
    font-size: 1.25rem;
    text-align: center;
    margin-bottom: 42px;

    @media screen and (min-width: $breakpointDesktop) {
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
    flex: 1;
    width: 0;
    min-width: 0;
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
