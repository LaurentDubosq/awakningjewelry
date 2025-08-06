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

/* Payment solutions */
export interface PaymentSolution {
  id: string
  url: string
  alt: string
  title: string
}
