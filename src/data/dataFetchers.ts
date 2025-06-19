import type { PageMetaData } from '@/types/router.d.ts'
import type { UseFetchWithStateReturn } from '@/types/fetch'
import {
  byGenderCollectionListingContentURL,
  statementMissionWordingURL,
  heroSlidesURL,
  promotionsProductListingContentURL,
  pagesMetaDataUrl,
  siteMenuUrl,
  newsletterSignupWordingURL,
  founderQuoteBannerContentURL,
} from '@/data/dataFetchersURL'
import type {
  SiteMenu,
  StatementBannerWording,
  NewsletterSignupWording,
  QuoteBannerContent,
  CollectionListingContent,
  HeroSlideType,
} from '@/types/components.d.ts'
import type { ProductListingContent } from '@/types/components'
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

export const getByGenderCollectionListingContent =
  (): UseFetchWithStateReturn<CollectionListingContent> => {
    const result: UseFetchWithStateReturn<CollectionListingContent> = useFetchWithState(
      byGenderCollectionListingContentURL,
    )
    return result
  }

export const getPromotionsProductListingContent =
  (): UseFetchWithStateReturn<ProductListingContent> => {
    const result: UseFetchWithStateReturn<ProductListingContent> = useFetchWithState(
      promotionsProductListingContentURL,
    )
    return result
  }

export const getNewsletterSignupWording = (): UseFetchWithStateReturn<NewsletterSignupWording> => {
  const result: UseFetchWithStateReturn<NewsletterSignupWording> = useFetchWithState(
    newsletterSignupWordingURL,
  )
  return result
}

export const getFounderQuoteBannerContent = (): UseFetchWithStateReturn<QuoteBannerContent> => {
  const result: UseFetchWithStateReturn<QuoteBannerContent> = useFetchWithState(
    founderQuoteBannerContentURL,
  )
  return result
}
