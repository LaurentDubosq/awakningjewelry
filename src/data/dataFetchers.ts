import type { PageMetaData } from '@/types/router.d.ts'
import type { UseFetchWithStateReturn } from '@/types/fetch'
import {
  collectionListingByGenderURL,
  statementMissionWordingURL,
  heroSlidesURL,
  promotionsURL,
  pagesMetaDataUrl,
  siteMenuUrl,
  newsletterSignupWordingURL,
  founderQuoteBannerContentURL,
} from '@/data/dataFetchersURL'
import type {
  SiteMenu,
  StatementBannerWording,
  HeroSlideType,
  NewsletterSignupWording,
  QuoteBannerContent,
  CollectionListing,
} from '@/types/components.d.ts'
import type { ProductSummary } from '@/types/global.d.ts'
import { useFetch } from '@/composables/useFetch'
import { useFetchWithState } from '@/composables/useFetchWithState'

export const getPagesMetaData = async (): Promise<PageMetaData[] | undefined> => {
  const result: PageMetaData[] | undefined = await useFetch(pagesMetaDataUrl)
  return result
}

export const getSiteMenu = (): UseFetchWithStateReturn<SiteMenu> => {
  const result: UseFetchWithStateReturn<SiteMenu> = useFetchWithState(siteMenuUrl)
  return result
}

export const getHeroSlides = (): UseFetchWithStateReturn<HeroSlideType[]> => {
  const result: UseFetchWithStateReturn<HeroSlideType[]> = useFetchWithState(heroSlidesURL)
  return result
}

export const getStatementMissionWordingAsyncResult =
  (): UseFetchWithStateReturn<StatementBannerWording> => {
    const result: UseFetchWithStateReturn<StatementBannerWording> = useFetchWithState(
      statementMissionWordingURL,
    )
    return result
  }

export const getCollectionListingByGender = (): UseFetchWithStateReturn<CollectionListing> => {
  const result: UseFetchWithStateReturn<CollectionListing> = useFetchWithState(
    collectionListingByGenderURL,
  )
  return result
}

export const getPromotions = (): UseFetchWithStateReturn<ProductSummary[]> => {
  const result: UseFetchWithStateReturn<ProductSummary[]> = useFetchWithState(promotionsURL)
  return result
}

export const getNewsletterSignupWordingAsyncResult =
  (): UseFetchWithStateReturn<NewsletterSignupWording> => {
    const result: UseFetchWithStateReturn<NewsletterSignupWording> = useFetchWithState(
      newsletterSignupWordingURL,
    )
    return result
  }

export const getFounderQuoteBannerContentAsyncResult =
  (): UseFetchWithStateReturn<QuoteBannerContent> => {
    const result: UseFetchWithStateReturn<QuoteBannerContent> = useFetchWithState(
      founderQuoteBannerContentURL,
    )
    return result
  }
