<script setup lang="ts">
import { computed, ref, type ComputedRef, type Ref } from 'vue'
import { subscribeToNewsletter } from '@/services/newsletterSignup'
import type { NewsletterSignupResult } from '@/types/services'
import type { NewsletterSignupForm } from '@/types/features'

const { form } = defineProps<{
  form: NewsletterSignupForm
}>()

const email: Ref<string> = ref('')
const signupResult: Ref<undefined | NewsletterSignupResult> = ref()

const hasSignupSucceeded: ComputedRef<boolean> = computed(() => {
  return signupResult.value?.status === 'success'
})
const hasSignupFailed: ComputedRef<boolean> = computed(() => {
  return signupResult.value?.status === 'error'
})
const hasSignupReturnedMessage: ComputedRef<boolean> = computed(() => {
  return !!signupResult.value?.message
})

const handleSubmit = async () => {
  signupResult.value = await subscribeToNewsletter(email.value)
}
</script>

<template>
  <form
    class="newsletter-signup__form"
    @submit.prevent="handleSubmit"
    data-testid="newsletter-signup__form"
  >
    <div
      class="newsletter-signup__form-inner-container"
      v-if="signupResult === undefined || hasSignupFailed"
      data-testid="newsletter-signup__form-inner-container"
    >
      <label
        class="sr-only"
        for="newsletter-signup__form-input"
        data-testid="newsletter-signup__form-label"
        >{{ form.label }}</label
      >
      <input
        class="newsletter-signup__form-input"
        id="newsletter-signup__form-input"
        type="email"
        v-model="email"
        :placeholder="form.inputPlaceholder"
        :title="form.inputTitle"
        :aria-invalid="hasSignupFailed"
        :aria-describedby="hasSignupReturnedMessage ? 'newsletter-signup__form-message' : undefined"
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
        {{ form.buttonText }}
      </button>
    </div>
    <p
      class="newsletter-signup__form-message"
      id="newsletter-signup__form-message"
      v-if="hasSignupReturnedMessage"
      :class="{
        'newsletter-signup__form-message-success': hasSignupSucceeded,
        'newsletter-signup__form-message-error': hasSignupFailed,
      }"
      role="alert"
      data-testid="newsletter-signup__form-message"
    >
      {{ signupResult?.message }}
    </p>
  </form>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants.scss' as *;

.newsletter-signup__form {
  background-color: $AwakningColorBackground;
  padding: 10px;
  max-width: 520px;
  margin: 0 auto 30px;

  &-inner-container {
    display: flex;
  }

  &-input {
    padding: 8px 10px;
    flex: 1;
    width: 0;
    min-width: 0;
  }

  &-message {
    padding: 6px 12px;
    font-size: 0.9rem;
  }

  &-message-success {
    background-color: $AwakningColorBackgroundSuccess;
    border: 1px solid $AwakningColorSuccess;
    color: $AwakningColorSuccess;
  }

  &-message-error {
    margin-top: 10px;
    background-color: $AwakningColorBackgroundError;
    border: 1px solid $AwakningColorError;
    color: $AwakningColorError;
  }
}
</style>
