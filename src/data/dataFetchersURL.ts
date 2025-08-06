export const SITE_DATA_API_BASE_URL: string = import.meta.env.VITE_SITE_DATA_API_URL

const endpoint = (path: string): string => `${SITE_DATA_API_BASE_URL}/${path}`

/* PagesMetaData */
export const pagesMetaDataUrl = endpoint('pagesMetaData')

/* SiteMenu */
export const siteMenuUrl = endpoint('siteMenu')

/* HeroSlides */
export const heroSlidesUrl = endpoint('heroSlides')

/* MissionStatementBannerContent */
export const missionStatementBannerContentUrl = endpoint('missionStatementBannerContent')

/* ByGenderCollectionListingContent */
export const byGenderCollectionListingContentUrl = endpoint('byGenderCollectionListingContent')

/* PromotionsProductListingContent */
export const promotionsProductListingContentUrl = endpoint('promotionsProductListingContent')

/* NewsletterSignupWording */
export const newsletterSignupWordingUrl = endpoint('newsletterSignupWording')

/* FounderQuoteBannerContent */
export const founderQuoteBannerContentUrl = endpoint('founderQuoteBannerContent')

/* SiteFooter */
export const siteFooterUrl = endpoint('siteFooter')

/* PaymentSolutions */
export const paymentSolutionsUrl = endpoint('paymentSolutions')
