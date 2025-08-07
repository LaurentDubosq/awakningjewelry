import type { Collection } from './global.js'

/* SiteNav & BurgerMenu */
export type SiteMenu = (SiteMenuLink | SiteMenuDropdown)[]
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
  links: SiteMenuDropdownLink[]
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

/* Hero */
export interface HeroSlideType {
  id: number
  images: HeroSlideImages
  imageAlt: string
  subtitle: string
  title: string
  url: string
}
export interface HeroSlideImages {
  mobile: string
  mobileLandscape: string
  desktop: string
  desktopLarge: string
  alt: string
}

/* StatementBanner */
export interface StatementBannerContent {
  title: string
  statement: string
  image: StatementBannerContentImage
}
export interface StatementBannerContentImage {
  url: string
  alt: string
}

/* CollectionListing */
export interface CollectionListingContent {
  title: string
  collections: Collection[]
}

/* ProductListing */
export interface ProductListingContent {
  title: string
  products: ProductListingProduct[]
}
export interface ProductListingProduct {
  id: number
  title: string
  image: ProductListingProductImage
  price: string
  promotionalPrice: string
  url: string
}
export interface ProductListingProductImage {
  url: string
  alt: string
}

/* Slideshow */
export interface DisplaySlidePayload {
  index: number
  focusable: boolean
}

/* NewsletterSignup */
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

/* QuoteBanner */
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

/* SiteFooter */
export interface SiteFooter {
  links: SiteFooterLink[]
  socialLinks: SiteFooterSocialLink[]
  copyright: SiteFooterCopyright
  technologyProvider: SiteFooterTechnologyProdiver
  paymentSolutions: PaymentSolution[]
}

export interface SiteFooterLink {
  id: string
  logo?: string
  text: string
  url: string
  alt?: string
  title?: string
}
