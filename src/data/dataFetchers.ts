import type { PageMetaData } from '@/types/router.d.ts'
import type { UseFetchWithStateReturn } from '@/types/fetch'
import {
  byGenderCollectionListingContentURL,
  missionStatementBannerContentURL,
  heroSlidesURL,
  promotionsProductListingContentURL,
  pagesMetaDataUrl,
  siteMenuUrl,
  newsletterSignupWordingURL,
  founderQuoteBannerContentURL,
} from '@/data/dataFetchersURL'
import type {
  SiteMenu,
  StatementBannerContent,
  NewsletterSignupWording,
  QuoteBannerContent,
  CollectionListingContent,
  HeroSlideType,
  ProductListingContent,
} from '@/types/components.d.ts'
import { useFetch } from '@/composables/useFetch'
import { useFetchWithState } from '@/composables/useFetchWithState'

export const getPagesMetaData = async (): Promise<PageMetaData[] | undefined> =>
  await useFetch(pagesMetaDataUrl)

export const getSiteMenu = (): UseFetchWithStateReturn<SiteMenu> => useFetchWithState(siteMenuUrl)

export const getHeroSlides = (): UseFetchWithStateReturn<HeroSlideType[]> =>
  useFetchWithState(heroSlidesURL)

export const getMissionStatementBannerContent =
  (): UseFetchWithStateReturn<StatementBannerContent> =>
    useFetchWithState(missionStatementBannerContentURL)

export const getByGenderCollectionListingContent =
  (): UseFetchWithStateReturn<CollectionListingContent> =>
    useFetchWithState(byGenderCollectionListingContentURL)

export const getPromotionsProductListingContent =
  (): UseFetchWithStateReturn<ProductListingContent> =>
    useFetchWithState(promotionsProductListingContentURL)

export const getNewsletterSignupWording = (): UseFetchWithStateReturn<NewsletterSignupWording> =>
  useFetchWithState(newsletterSignupWordingURL)

export const getFounderQuoteBannerContent = (): UseFetchWithStateReturn<QuoteBannerContent> =>
  useFetchWithState(founderQuoteBannerContentURL)
