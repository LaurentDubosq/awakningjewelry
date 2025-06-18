/* Collection */
export interface Collection {
  image: CollectionImage
  title: string
  url: string
}

export interface CollectionImage {
  url: string
  alt: string
}

export type Collections = Array<Collection>

/* Product */
export interface ProductSummary {
  title: string
  image: ProductSummaryImage
  price: string
  promotionalPrice: string
  url: string
}

export interface ProductSummaryImage {
  url: string
  alt: string
}

/* Input */
interface NewsletterSignupResult {
  status: 'success' | 'error'
  message: string
}
