import type { PageMetaData } from '@/types/router.d.ts'
import type { SiteMenuItem } from '@/types/components.d.ts'
import type { UseFetchWithStateReturn } from '@/types/fetch'
import {
  collectionsByGenderURL,
  statementMissionURL,
  heroSlidesURL,
  promotionsURL,
  pagesMetaDataUrl,
  siteMenuUrl,
  newsletterSignupWordingURL,
} from '@/data/dataFetchersURL'
import type {
  StatementBanner,
  HeroSlideType,
  NewsletterSignupWording,
} from '@/types/components.d.ts'
import type { Collection, ProductSummary } from '@/types/global.d.ts'
import { useFetch } from '@/composables/useFetch'
import { useFetchWithState } from '@/composables/useFetchWithState'

export const getPagesMetaData = async (): Promise<PageMetaData[] | undefined> => {
  const result: PageMetaData[] | undefined = await useFetch(pagesMetaDataUrl)
  return result
}

export const getSiteMenu = (): UseFetchWithStateReturn<SiteMenuItem[]> => {
  const result: UseFetchWithStateReturn<SiteMenuItem[]> = useFetchWithState(siteMenuUrl)
  return result
}

export const getHeroSlides = (): UseFetchWithStateReturn<HeroSlideType[]> => {
  const result: UseFetchWithStateReturn<HeroSlideType[]> = useFetchWithState(heroSlidesURL)
  return result
}

export const getStatementMission = (): UseFetchWithStateReturn<StatementBanner> => {
  const result: UseFetchWithStateReturn<StatementBanner> = useFetchWithState(statementMissionURL)
  return result
}

export const getCollectionsByGender = (): UseFetchWithStateReturn<Collection[]> => {
  const result: UseFetchWithStateReturn<Collection[]> = useFetchWithState(collectionsByGenderURL)
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
