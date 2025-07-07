import type { PageMetaData } from '@/types/router.d.ts'
import type { UseFetchWithStateReturn } from '@/types/fetch'
import {
  byGenderCollectionListingContentUrl,
  missionStatementBannerContentUrl,
  heroSlidesUrl,
  promotionsProductListingContentUrl,
  pagesMetaDataUrl,
  siteMenuUrl,
  newsletterSignupWordingUrl,
  founderQuoteBannerContentUrl,
} from '@/data/dataFetchersUrl'
import type {
  SiteMenu,
  StatementBannerContent,
  NewsletterSignupWording,
  QuoteBannerContent,
  CollectionListingContent,
  HeroSlideType,
  ProductListingContent,
} from '@/types/features'
import useFetch from '@/composables/useFetch'
import useFetchWithState from '@/composables/useFetchWithState'

export const getPagesMetaData = async (): Promise<PageMetaData[] | undefined> =>
  await useFetch(pagesMetaDataUrl)

export const getSiteMenu = (): UseFetchWithStateReturn<SiteMenu> => useFetchWithState(siteMenuUrl)

export const getHeroSlides = (): UseFetchWithStateReturn<HeroSlideType[]> =>
  useFetchWithState(heroSlidesUrl)

export const getMissionStatementBannerContent =
  (): UseFetchWithStateReturn<StatementBannerContent> =>
    useFetchWithState(missionStatementBannerContentUrl)

export const getByGenderCollectionListingContent =
  (): UseFetchWithStateReturn<CollectionListingContent> =>
    useFetchWithState(byGenderCollectionListingContentUrl)

export const getPromotionsProductListingContent =
  (): UseFetchWithStateReturn<ProductListingContent> =>
    useFetchWithState(promotionsProductListingContentUrl)

export const getNewsletterSignupWording = (): UseFetchWithStateReturn<NewsletterSignupWording> =>
  useFetchWithState(newsletterSignupWordingUrl)

export const getFounderQuoteBannerContent = (): UseFetchWithStateReturn<QuoteBannerContent> =>
  useFetchWithState(founderQuoteBannerContentUrl)
