<script setup lang="ts">
import LoadingComponent from './LoadingComponent.vue'
import ErrorComponent from './ErrorComponent.vue'
import { getSiteFooter } from '@/data/dataFetchers'
import { computed, type ComputedRef } from 'vue'
import type { SiteFooter, SiteFooterLink } from '@/types/features'
import type { UseFetchWithStateReturn } from '@/types/fetch'
import SiteFooterList from './SiteFooterList.vue'
import PaymentSolutions from './PaymentSolutions.vue'

const { data: footer, state: footerFetchState }: UseFetchWithStateReturn<SiteFooter> =
  getSiteFooter()
const MAX_MAIN_LINKS = 7
const currentYear = new Date().getFullYear()

const mainLinks: ComputedRef<SiteFooterLink[]> = computed(() => footer.value?.links || [])
const socialLinks: ComputedRef<SiteFooterLink[]> = computed(() => footer.value?.socialLinks || [])
const chunkedMainLinks: ComputedRef<SiteFooterLink[][]> = computed(() => {
  const currentLinks = mainLinks.value || []
  const result: SiteFooterLink[][] = []

  for (let i = 0; i < currentLinks.length; i += MAX_MAIN_LINKS) {
    result.push(currentLinks.slice(i, i + MAX_MAIN_LINKS))
  }

  return result
})
const groupedLinks: ComputedRef<SiteFooterLink[][]> = computed(() => [
  ...chunkedMainLinks.value,
  socialLinks.value,
])
</script>

<template>
  <footer class="site-footer" role="contentinfo">
    <template v-if="footerFetchState === 'fulfilled'">
      <div class="wrapper">
        <hr class="site-footer__separator" aria-hidden="true" />
        <div class="site-footer__content">
          <SiteFooterList :links="list" v-for="(list, index) in groupedLinks" :key="index" />
          <div class="site-footer__content-right">
            <p class="site-footer__copyright" data-testid="site-footer__copyright">
              © {{ currentYear }},
              <RouterLink to="/" data-testid="site-footer__copyright-brand-link"
                >Awakning Buddhist Jewelry</RouterLink
              >
            </p>
            <p
              class="site-footer__technology-provider"
              data-testid="site-footer__technology-provider"
            >
              <a
                href="https://www.shopify.com/?utm_campaign=poweredby&utm_medium=shopify&utm_source=onlinestore"
                rel="nofollow"
                target="_blank"
                data-testid="site-footer__technology-provider-link"
                >Powered by Shopify</a
              >
            </p>
            <PaymentSolutions />
          </div>
        </div>
      </div>
    </template>
    <LoadingComponent v-else-if="footerFetchState === 'pending'" />
    <ErrorComponent v-else-if="footerFetchState === 'rejected'" />
  </footer>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants' as *;

.site-footer {
  display: flex;
  justify-content: center;
  min-height: 335px;
  margin-bottom: 42.5px;

  @media screen and (min-width: $breakpointDesktop) {
    margin-bottom: 30px;
  }

  &__separator {
    margin: 60px auto;
  }

  &__content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;

    @media screen and (min-width: $breakpointMobileLandscape) {
      grid-template-columns: 1fr 1fr;
    }

    @media screen and (min-width: $breakpointDesktop) {
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 30px;
    }
  }

  &__copyright {
    text-align: center;
    @media screen and (min-width: $breakpointDesktop) {
      text-align: right;
    }
  }

  &__technology-provider {
    text-align: center;
    @media screen and (min-width: $breakpointDesktop) {
      text-align: right;
    }
  }
}
</style>
