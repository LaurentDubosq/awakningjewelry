import type {
  Collection,
  Product,
  InputSuccessResult,
  InputErrorResult,
} from '../types/global.d.js'

/* SiteMenu */
export type SiteMenu = Array<SiteMenuLink | SiteMenuDropdown>
export interface SiteMenuLink {
  id: number
  type: 'textLink' | 'iconLink'
  name?: string
  text: string
  url: string
  title: string
}
export interface SiteMenuDropdown {
  id: number
  type: string
  button: SiteMenuDropdownButton
  links: SiteMenuDropdownLinks
}
export interface SiteMenuDropdownButton {
  text: string
  title: string
}
export interface SiteMenuDropdownLink {
  id: number
  text: string
  url: string
}
export type SiteMenuDropdownLinks = Array<SiteMenuDropdownLink>

/* Hero */
export interface HeroSlideType {
  id: number
  images: HeroSlideImages
  subtitle: string
  title: string
  url: string
}
export interface HeroSlideImages {
  mobile: HeroSlideImage
  desktop: HeroSlideImage
  alt: string
}
export interface HeroSlideImage {
  url: string
}

/* StatementBanner wording */
export interface StatementBannerWording {
  title: string
  statement: string
  image: StatementBannerWordingImage
}
export interface StatementBannerWordingImage {
  url: string
  alt: string
}

/* CollectionListing */
export interface CollectionListing {
  title: string
  collections: Collection[]
}

/* ProductListing */
export interface ProductListing {
  title: string
  products: Product[]
}

/* Slideshow */
export interface DisplaySlidePayload {
  index: number
  focusable: boolean
}

/* NewsletterSignup wording */
export interface NewsletterSignupWording {
  title: string
  description: string
  inputPlaceholder: string
  inputTitle: string
  label: string
  buttonText: string
  consentNote: string
  consentNoteLinkText: string
  unsubscriptionNote: string
  unsubscriptionNoteLinkText: string
}

export type NewsletterSignupResponse = InputSuccessResult | InputErrorResult

/* QuoteBanner content */
export interface QuoteBannerContent {
  backgroundIMGMobile: string
  backgroundIMGMobileLandscape: string
  backgroundIMGDesktop: string
  backgroundIMGDesktopLarge: string
  quote: string
  author: string
  authorIMG: string
  authorIMGAlt: string
  authorIMGTitle: string
  linkText: string
  linkURL: string
}
