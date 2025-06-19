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

/* Input */
interface NewsletterSignupResult {
  status: 'success' | 'error'
  message: string
}
