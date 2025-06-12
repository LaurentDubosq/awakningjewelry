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
interface InputSuccessResult {
  success: true
  error?: false
  message: string
}

interface InputErrorResult {
  success?: false
  error: true
  message: string
}
