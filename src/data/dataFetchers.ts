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
  siteFooterUrl,
  paymentSolutionsUrl,
  announcementBarWordingUrl,
} from '@/data/dataFetchersURL'
import type {
  SiteMenu,
  StatementBannerContent,
  NewsletterSignupWording,
  QuoteBannerContent,
  CollectionListingContent,
  HeroSlideType,
  ProductListingContent,
  SiteFooter,
  AnnouncementBarWording,
} from '@/types/features'
import useFetch from '@/composables/useFetch'
import useFetchWithState from '@/composables/useFetchWithState'
import type { PaymentSolution } from '@/types/global'

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

export const getSiteFooter = (): UseFetchWithStateReturn<SiteFooter> =>
  useFetchWithState(siteFooterUrl)

export const getPaymentSolutions = (): UseFetchWithStateReturn<PaymentSolution[]> =>
  useFetchWithState(paymentSolutionsUrl)

export const getAnnouncementBarWording = (): UseFetchWithStateReturn<AnnouncementBarWording> =>
  useFetchWithState(announcementBarWordingUrl)
