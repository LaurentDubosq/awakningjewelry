import type { Collection, Product } from '../types/global.d.js'

/* SiteMenu */
export interface SiteMenuItem {
  id: number
  type: string
  text: string
  url: string
  name?: string
  subMenu?: Array<SiteSubMenuItem>
  title: string
}
export interface SiteSubMenuItem {
  id: number
  text: string
  url: string
}

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

/* StatementBanner */
export interface StatementBanner {
  title: string
  text: string
  image: StatementBannerImage
}
export interface StatementBannerImage {
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
