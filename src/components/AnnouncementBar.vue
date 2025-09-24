<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import IconCross from './icons/IconCross.vue'
import type { FetchState, UseFetchWithStateReturn } from '@/types/fetch'
import type { AnnouncementBarWording } from '@/types/features'
import { getAnnouncementBarWording } from '@/data/dataFetchers'
import LoadingComponent from './LoadingComponent.vue'
import ErrorComponent from './ErrorComponent.vue'
import DOMPurify from 'dompurify'

const fetchResult: UseFetchWithStateReturn<AnnouncementBarWording> = getAnnouncementBarWording()

const wording: ComputedRef<AnnouncementBarWording | undefined> = computed(
  () => fetchResult?.data.value,
)
const wordingFetchState: ComputedRef<FetchState | undefined> = computed(
  () => fetchResult?.state.value,
)
const sanitizedAnnouncement = computed(() =>
  wording.value?.announcement ? DOMPurify.sanitize(wording.value.announcement) : '',
)
</script>

<template>
  <section class="announcement-bar" aria-label="Site announcement" data-testid="announcement-bar">
    <template v-if="wordingFetchState === 'fulfilled'">
      <div class="announcement-bar__inner-container wrapper">
        <p class="announcement-bar__announcement" data-testid="announcement-bar__announcement">
          <span v-html="sanitizedAnnouncement" />
        </p>
        <button
          class="announcement-bar__button"
          @click="$emit('closeAnnouncementBar')"
          data-testid="announcement-bar__button"
        >
          <IconCross class="announcement-bar__icon" width="27" />
          <span class="sr-only" data-testid="announcement-bar__icon-alternative-text"
            >Close announcement bar</span
          >
        </button>
      </div>
    </template>
    <LoadingComponent v-else-if="wordingFetchState === 'pending'" />
    <ErrorComponent v-else-if="wordingFetchState === 'rejected'" />
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants.scss' as *;

.announcement-bar {
  height: 45px;
  background-color: $AwakningColorPrimary;
  color: $AwakningColorSecondary;
  display: flex;
  justify-content: center;
  align-items: center;

  @media screen and (min-width: $breakpointDesktop) {
    height: 40px;
  }

  &__inner-container {
    width: 100%;
    display: grid;
    align-items: center;
    grid-template-columns: 1fr auto 1fr;
    gap: 10px;
  }

  &__announcement {
    grid-column: 2;
    font-size: 12px;
    font-family: $AwakningFontMontserrat;
    text-align: center;

    @media screen and (min-width: $breakpointDesktop) {
      font-size: 14px;
    }
  }
  &__announcement :deep(strong) {
    font-weight: 600;
  }

  &__button {
    justify-self: flex-end;
    cursor: pointer;
  }

  &__icon {
    fill: $AwakningColorSecondary;
  }
}
</style>
