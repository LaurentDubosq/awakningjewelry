<script setup lang="ts">
import type { QuoteBannerContent } from '@/types/features'
import type { FetchState } from '@/types/fetch'
import LoadingComponent from './LoadingComponent.vue'
import ErrorComponent from './ErrorComponent.vue'

const { content, contentFetchState } = defineProps<{
  content?: QuoteBannerContent
  contentFetchState?: FetchState
}>()
</script>

<template>
  <section class="quote-banner" :aria-label="`${content?.author} quote`" data-testid="quote-banner">
    <template v-if="contentFetchState === 'fulfilled'">
      <div class="quote-banner__inner-container">
        <figure class="quote-banner__figure">
          <blockquote class="quote-banner__blockquote">
            <p class="quote-banner__quote" data-testid="quote-banner__quote">
              {{ content?.quote }}
            </p>
          </blockquote>
          <figcaption class="quote-banner__figcaption">
            <span class="quote-banner__author" data-testid="quote-banner__author">
              {{ content?.author }}</span
            >
            <img
              class="quote-banner__author-photo"
              :src="content?.authorIMG"
              :alt="content?.authorIMGAlt"
              :title="content?.authorIMGTitle"
              width="100"
              height="100"
              loading="lazy"
              data-testid="quote-banner__author-photo"
            />
          </figcaption>
        </figure>
        <RouterLink
          class="quote-banner__link btn"
          :to="content!.linkURL"
          data-testid="quote-banner__link"
          >{{ content?.linkText }}</RouterLink
        >
      </div>
    </template>
    <LoadingComponent v-else-if="contentFetchState === 'pending'" />
    <ErrorComponent v-else-if="contentFetchState === 'rejected'" />
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants.scss' as *;

.quote-banner {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 55px;
  color: $AwakningColorSecondary;
  background-color: #59574f;
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.651), rgba(0, 0, 0, 0.6)),
    url('https://cdn.shopify.com/s/files/1/2275/5667/files/meditative-mountains-and-sunset-480w.avif');
  background-size: cover;
  background-position: center;
  min-height: 322px;

  @media screen and (min-width: $breakpointMobileLandscape) {
    background-image:
      linear-gradient(rgba(0, 0, 0, 0.651), rgba(0, 0, 0, 0.6)),
      url('https://cdn.shopify.com/s/files/1/2275/5667/files/meditative-mountains-and-sunset-768w.avif');
  }

  @media screen and (min-width: $breakpointDesktop) {
    padding: 45px 55px;
    background-image:
      linear-gradient(rgba(0, 0, 0, 0.651), rgba(0, 0, 0, 0.6)),
      url('https://cdn.shopify.com/s/files/1/2275/5667/files/meditative-mountains-and-sunset-1279w.avif');
  }

  @media screen and (min-width: $breakpointDesktopLarge) {
    background-image:
      linear-gradient(rgba(0, 0, 0, 0.651), rgba(0, 0, 0, 0.6)),
      url('https://cdn.shopify.com/s/files/1/2275/5667/files/meditative-mountains-and-sunset-1600w.avif');
  }

  &__inner-container {
    margin: 0 auto;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }

  &__blockquote {
    padding: 0 25px;
    margin-bottom: 40px;
  }

  &__quote {
    font-size: 1.25rem;
  }

  &__figcaption {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }

  &__author {
    text-align: center;
    font-style: italic;
  }

  &__link {
    background-color: $AwakningColorSecondary;
    color: $AwakningColorPrimary;
  }
}
</style>
